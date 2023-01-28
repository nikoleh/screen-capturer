function toggleStartButton (options) {
    document.getElementById('start').disabled = options.disabled
}

function toggleStopButton (options) {
    document.getElementById('stop').disabled = options.disabled
}

function showRecording (url) {
    const videoElement = document.createElement('video')
    videoElement.src = url
    videoElement.controls = true
    document.getElementById('video-container').append(videoElement)
}