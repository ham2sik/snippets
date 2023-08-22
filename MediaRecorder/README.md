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
if (isSupported(variation)) supported.push(variation);
}),
);
if (isSupported(mimeType)) supported.push(mimeType);
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
console.log("-- Top supported Video : ", supportedVideos[0]);
console.log("-- Top supported Audio : ", supportedAudios[0]);
console.log("-- All supported Videos : ", supportedVideos);
console.log("-- All supported Audios : ", supportedAudios);

// 크롬 타입 결정 코드

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
}
```
### 영상 코드(https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
```javascript
const constants = {};
constants.constraints = {
  audio: true,`
  video: {
    width: {ideal: 640},
    height: {ideal: 360},
  },
};
constants.videoBitsPerSecond = 1000000;
export default constants;
```
```
  `let chunks = [];

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);

      visualize(stream);

      record.onclick = () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
      };

      stop.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
      };

      mediaRecorder.onstop = (e) => {
        console.log("data available after MediaRecorder.stop() called.");

        const clipName = prompt("Enter a name for your sound clip");

        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");

        clipContainer.classList.add("clip");
        audio.setAttribute("controls", "");
        deleteButton.textContent = "Delete";
        clipLabel.textContent = clipName;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        audio.controls = true;
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;
        console.log("recorder stopped");

        deleteButton.onclick = (e) => {
          const evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        };
      };

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
    })
    .catch((err) => {
      console.error(`The following error occurred: ${err}`);`

errorCheckExamS(error);
    `});
}`

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
