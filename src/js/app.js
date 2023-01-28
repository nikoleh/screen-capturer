function createApp () {
    let recorder = createRecorder()
    let recordingObjectUrl
    function handleStop (url) {
        if (recordingObjectUrl) {
            window.URL.revokeObjectURL(recordingObjectUrl)
        }
        recordingObjectUrl = url
        showRecording(url)
        toggleStartButton({ disabled: false })
        toggleStopButton({ disabled: true })
        toggleDownloadButton({ disabled: false })
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

    function download() {
        let link = document.createElement('a')
        link.hidden = true
        link.href = recordingObjectUrl
        link.download = 'screen_capture.mp4'
        link.click()
        link.remove()
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
        stopRecording,
        download
    }
}