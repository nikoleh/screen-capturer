function createApp () {
    let recorder = createRecorder()

    function handleStop (url) {
        showRecording(url)
        toggleStartButton({ disabled: false })
        toggleStopButton({ disabled: true })
    }

    function handleStart () {
        toggleStartButton({ disabled: true })
        toggleStopButton({ disabled: false })
    }

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
            .then(stream => recorder
                .start(
                    stream,
                    { onTerminateStream: ({ url }) => handleStop(url) }
                )
            ).then(handleStart)
    }

    function stopRecording() {
        recorder.stop().then(({ url }) => handleStop(url))
    }

    return {
        startRecording,
        stopRecording
    }
}