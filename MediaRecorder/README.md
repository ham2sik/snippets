# MediaRecorder
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
