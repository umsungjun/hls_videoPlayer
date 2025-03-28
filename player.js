document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video"); // 비디오 태그 선택
  const qualitySelector = document.getElementById("quality-selector"); // 화질 선택 드롭다운
  const videoSrc = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // 테스트용 HLS 스트리밍 URL

  // HLS.js가 지원되는 브라우저인지 확인
  if (Hls.isSupported()) {
    console.log("HLS.js is supported!");
    const hls = new Hls(); // HLS.js 인스턴스 생성
    hls.loadSource(videoSrc); // m3u8 스트리밍 URL을 로드
    hls.attachMedia(video); // 비디오 태그에 연결

    // m3u8 manifest(재생 목록)가 파싱되었을 때 실행
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      const levels = hls.levels; // 사용 가능한 화질 리스트 가져오기
      qualitySelector.innerHTML = ""; // 기존 옵션 초기화

      // '자동' 화질 옵션 추가 (HLS.js가 최적의 화질을 자동 선택함)
      const autoOption = document.createElement("option");
      autoOption.value = "-1";
      autoOption.textContent = "자동";
      qualitySelector.appendChild(autoOption);

      // 화질 옵션을 드롭다운에 추가
      levels.forEach((level, index) => {
        console.log(level);
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${level.height}p`; // 화질 퀄리티를 height로 제공함
        qualitySelector.appendChild(option);
      });

      // 화질 변경 이벤트 리스너 추가
      qualitySelector.addEventListener("change", function () {
        const selectedQuality = parseInt(qualitySelector.value, 10); // 선택된 화질 인덱스
        hls.currentLevel = selectedQuality; // 선택된 화질로 변경 (-1은 자동 모드)
      });
    });
  }
  // Safari 브라우저처럼 기본적으로 HLS를 지원하는 경우
  else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    console.log("Native HLS");
    video.src = videoSrc;
    video.addEventListener("loadedmetadata", function () {
      video.play(); // 메타데이터가 로드되면 자동 재생
    });
  }
});
