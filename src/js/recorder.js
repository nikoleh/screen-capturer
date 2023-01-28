function createRecorder () {
    let chunks = []
    let mediaRecorder
    return {
        start: (stream) => new Promise(resolve => {
            mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.addEventListener('start', () => {
                resolve()
            })

            mediaRecorder.addEventListener('dataavailable', (event) => {
                chunks.push(event.data)
            })

            mediaRecorder.start()
        }),
        stop: () => new Promise((resolve, reject) => {
            if (!mediaRecorder) {
                reject(new Error('Stream not available'))
            }

            mediaRecorder.addEventListener('stop', () => {
                const blob = new Blob(chunks, { type: 'video/webm'})
                const url = window.URL.createObjectURL(blob)
                chunks = []
                resolve({ blob, url })
            })
            mediaRecorder.stop()
        })
    }
}