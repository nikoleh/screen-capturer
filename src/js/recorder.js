function createRecorder () {
    let chunks = []
    let mediaRecorder
    function start (stream, options) {
        return new Promise(resolve => {
            stream.getTracks().forEach(track => {
                track.onended = () => {
                    stop().then(({url, blob}) => {
                        if (options.onTerminateStream) {
                            options.onTerminateStream({url, blob})
                        }
                    })
                }
            })

            mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.addEventListener('dataavailable', (event) => {
                chunks.push(event.data)
            })

            mediaRecorder.addEventListener('start', () => {
                resolve()
            })
    
            mediaRecorder.start()
        })
    } 

    function stop () {
        return new Promise((resolve, reject) => {
            if (!mediaRecorder) {
                reject(new Error('Stream not available'))
            }

            mediaRecorder.stream.getTracks().forEach(track => track.stop())
    
            mediaRecorder.addEventListener('stop', () => {
                const blob = new Blob(chunks, { type: 'video/webm'})
                const url = window.URL.createObjectURL(blob)
                chunks = []
                resolve({ blob, url })
            })

            mediaRecorder.stop()
        })
    }

    return {
        start,
        stop
    }
}