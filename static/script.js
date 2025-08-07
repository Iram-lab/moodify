document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureButton = document.getElementById("capture");
    const resultText = document.getElementById("result");

    // Access user's webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Error accessing webcam:", err);
        });

    // Capture frame and send to Flask backend
    captureButton.addEventListener("click", function () {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");

        fetch("/detect", {
            method: "POST",
            body: JSON.stringify({ image: imageData }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            resultText.innerText = "Detected Emotion: " + data.emotion;
        })
        .catch(error => {
            console.error("Error detecting emotion:", error);
        });
    });
});
