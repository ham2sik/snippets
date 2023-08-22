# MediaRecorder(https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
## 업로드 인코딩
### YouTube 기준 권장 업로드 인코딩: https://support.google.com/youtube/answer/1722171?hl=ko#zippy=%2C%EB%B9%84%ED%8A%B8-%EC%A0%84%EC%86%A1%EB%A5%A0
### YouTube 기준 라이브 인코더 설정, 비트 전송률, 해상도: https://support.google.com/youtube/answer/2853702?hl=ko#zippy=%2Cp
### 저장용량 테스트 케이스
* 848x480, 2,500Kbps: default
* 854x480, 2,000Kbps: 480p 스트리밍
* 640x360, 1,000Kbps: 360p 스트리밍 (예상 선택값)
* 426x240, 700Kbps: 240p 스트리밍
### 테스트
* 848x480, 2,500Kbps: 녹화영상 14.3MB
* 854x480, 2,000Kbps: 녹화영상 12.4MB
* 640x360, 1,000Kbps: 녹화영상 6.5MB, 업로드용량 8.3MB
* 426x240, 700Kbps: 녹화영상 5.2MB, 업로드용량 6.6MB
자체 암호화로 업로드 용량 10MB 제한
## 코드
### 타입 추출 코드(https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static)
```javascript
    /**
     * 지원하는 코덱정보를 콘솔로 제공(개발용)
     */
    getSupportedInfo() {
      const videoTypes = ["webm", "ogg", "mp4", "x-matroska"];
      const audioTypes = ["webm", "ogg", "mp3", "x-matroska"];
      const codecs = [
        "should-not-be-supported",
        "vp9",
        "vp9.0",
        "vp8",
        "vp8.0",
        "avc1",
        "av1",
        "h265",
        "h.265",
        "h264",
        "h.264",
        "opus",
        "pcm",
        "aac",
        "mpeg",
        "mp4a",
      ];
      // eslint-disable-next-line no-shadow
      const getSupportedMimeTypes = function (media, types, codecs) {
        const isSupported = MediaRecorder.isTypeSupported;
        const supported = [];
        types.forEach((type) => {
          const mimeType = `${media}/${type}`;
          codecs.forEach((codec) =>
            [
              `${mimeType};codecs=${codec}`,
              `${mimeType};codecs=${codec.toUpperCase()}`,
            ].forEach((variation) => {
              if (isSupported(variation)) {
                supported.push(variation);
              }
            }),
          );
          if (isSupported(mimeType)) {
            supported.push(mimeType);
          }
        });
        return supported;
      };
      const supportedVideos = getSupportedMimeTypes(
        "video",
        videoTypes,
        codecs,
      );
      const supportedAudios = getSupportedMimeTypes(
        "audio",
        audioTypes,
        codecs,
      );
      // eslint-disable-next-line no-console
      console.log("-- Top supported Video : ", supportedVideos[0]);
      // eslint-disable-next-line no-console
      console.log("-- Top supported Audio : ", supportedAudios[0]);
      // eslint-disable-next-line no-console
      console.log("-- All supported Videos : ", supportedVideos);
      // eslint-disable-next-line no-console
      console.log("-- All supported Audios : ", supportedAudios);
    },
```
### 영상 코드(https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
```javascript
const constants = {};
constants.constraints = {
  audio: true,
  video: {
    width: {ideal: 640},
    height: {ideal: 360},
  },
};
constants.videoBitsPerSecond = 1000000;
export default constants;
```
```javascript
    init() {
      ...
      // 카메라, 마이크 권한 요청
      navigator.mediaDevices
        .getUserMedia(constants.constraints)
        .then((stream) => {
          // this.getSupportedInfo();

          if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
            this.fileName = "video.webm";
            this.mimeType = "video/webm;codecs=vp9";
          } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
            this.fileName = "video.webm";
            this.mimeType = "video/webm;codecs=h264";
          } else if (MediaRecorder.isTypeSupported("video/webm")) {
            this.fileName = "video.webm";
            this.mimeType = "video/webm";
          } else if (MediaRecorder.isTypeSupported("video/mp4")) {
            //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
            this.fileName = "video.mp4";
            this.mimeType = "video/mp4";
          } else {
            this.modalError(this.$i18n.t("S_ModalError.mimeTypeNull"), "/");
            return;
          }

          this.bindVideoStream(stream);
          this.runExam();
        })
        .catch((error) => {
          this.errorCheckExamS(error);
        });
},
```
```javascript
    uploadRecord() {
      this.isSaving = true;

      const blob = new Blob(this.recordedBlobs, {
        type: this.mimeType,
      });
      // console.log("make blob", blob);

      const file = new File([blob], this.fileName, {
        type: this.mimeType,
      });
      // console.log("make file", file);
      // const url = window.URL.createObjectURL(file);
      // console.log("url", url);

      const formData = new FormData();
      formData.append(
        "questionIdx",
        this.answers[this.pageIndex - 1].questionIdx,
      );
      formData.append("answerIdx", this.answers[this.pageIndex - 1].answerIdx);
      formData.append(
        "selectedAnswerIdx",
        this.answers[this.pageIndex - 1].selectedAnswerIdx,
      );
      formData.append("partIdx", this.partIdx);
      formData.append("lastPageNo", this.pageIndex + 1);
      formData.append("file", file);
      // console.log(formData);
      // axios
      axios
        .post("/upload", formData, {
          headers: { "Content-Type": `multipart/form-data` },
        })
        .then((res) => {
          if (!this.isLastpage) {
            this.isSaving = false;
            this.isDisabled = true;
            this.pageIndex += 1;
            // 세션 저장 로직(새로고침 대응)
            this.questions.last_page_no = this.pageIndex;
            sessionStorage.setItem("PCTR", JSON.stringify(this.questions));

            this.runExam();
          } else {
            // 종료 status
          }
        })
        .catch((error) => {
          this.isSaving = false;
          this.errorCheck(error);
        });
    },
    bindVideoStream(stream) {
      this.stream = stream;
      document.getElementById("record").srcObject = stream;
    },
    startRecord() {
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: this.mimeType,
          videoBitsPerSecond: constants.videoBitsPerSecond,
        });

        this.mediaRecorder.ondataavailable = this.handleDataAvailable;
        this.mediaRecorder.start();
      } catch (e) {
        this.modalError(
          this.$i18n.t("S_ModalError.recordFail"),
          "/exams_setting",
        );
      }
    },
    stopRecord() {
      clearInterval(this.timer.progressTimer);
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        this.uploadRecord();
      };
    },
```
```javascript
    /**
     * API error시 체크
     * @param {Object} error error data
     */
    errorCheckExamS(error) {
      const name = error.name;
      if (
        name === "NotFoundError" ||
        name === "OverconstrainedError" ||
        name === "NotReadableError" ||
        name === "NotAllowedError"
      ) {
        const i18nCode = `S_ModalError.${name}`;
        if (this.$i18n.te(i18nCode)) {
          this.modalError(this.$i18n.t(i18nCode), "/exams_setting");
        } else {
          this.modalError(this.$i18n.t("modalError.default"), "/");
        }
      } else {
        this.modalError(this.$i18n.t("modalError.default"), "/");
      }
    },
```

errorCheckExamS(error) {
const name = [error.name](http://error.name/);
if (
name === "NotFoundError" ||
name === "OverconstrainedError" ||
name === "NotReadableError" ||
name === "NotAllowedError"
) {
const i18nCode = `S_ModalError.${name}`;
if (this.$i18n.te(i18nCode)) {
this.modalError(this.$i18n.t(i18nCode), "/exams_setting");
} else {
this.modalError(this.$i18n.t("modalError.default"), "/");
}
} else {
this.modalError(this.$i18n.t("modalError.default"), "/");
}
},
```
NotFoundError:
"사용할 수 있는 장치가 없습니다. 기기 내 카메라/마이크 장치를 확인해주세요. ",
OverconstrainedError:
"지원하지 않는 해상도입니다. 다른 기기에서 응시하시기 바랍니다. ",
NotReadableError:
"다른 브라우저 또는 기기에서 카메라/마이크 등 장치를 사용중이거나 사용가능한 장치가 없습니다. 기기 내 카메라/마이크 장치를 확인해주세요. ",
NotAllowedError:
"카메라/마이크 권한 설정을 확인해주세요. 권한설정을 차단한 경우 브라우저 설정에서 카메라/마이크 권한을 허용해야 합니다. ",
