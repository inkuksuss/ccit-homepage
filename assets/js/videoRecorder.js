const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById('jsRecordBtn');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

function stopStreameVideo(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
        track.stop();
    });
    videoElem.srcObject = null;
};

const handleVideoData = event => {
    const { data: videoFile } = event;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(videoFile);
    link.download = "recorded.webm";
    document.body.appendChild(link);
    link.click();
};

const stopRecording = () => {
    videoRecorder.stop();
    recordBtn.removeEventListener("click", stopRecording);
    recordBtn.addEventListener("click", getVideo);
    stopStreameVideo(videoPreview);
    recordBtn.innerHTML = "녹화 시작";
};

const startRecording = () => {
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", handleVideoData);
    recordBtn.addEventListener('click', stopRecording);
};

const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720}
        });
        videoPreview.srcObject = stream;
        videoPreview.muted = true;
        videoPreview.play();
        recordBtn.innerHTML = "녹화 종료";
        streamObject = stream;
        startRecording();
    } catch (err) {
        recordBtn.innerHTML = "🥵 녹화 불가";
    } finally {
        recordBtn.removeEventListener("click", getVideo);
    }
};

function init() {
    recordBtn.addEventListener("click", getVideo);
}


if(recorderContainer) {
    init();
};