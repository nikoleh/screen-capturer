function createApp () {
    let recorder = createRecorder()

    function startRecording() {
        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true
        })
            .then(recorder.start)
            .then(() => toggleStartButton({ disabled: true }))
            .then(() => toggleStopButton({ disabled: false }))
    }

    function stopRecording() {
        recorder.stop()
            .then(({ url }) => showRecording(url))
            .then(() => toggleStartButton({ disabled: false }))
            .then(() => toggleStopButton({ disabled: true }))
    }

    return {
        startRecording,
        stopRecording
    }
}