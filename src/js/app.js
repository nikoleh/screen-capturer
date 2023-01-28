function createApp () {
    let recorder = createRecorder()

    function getStream () {
        return Promise.all([
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }),
            navigator.mediaDevices.getUserMedia({
                audio: true
            })]
        ).then(streams => 
            new MediaStream(streams.reduce((previous, current) => 
                [...previous, ...current.getTracks()],
                []
            ))
        )
    }
    function startRecording() {
        getStream()
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