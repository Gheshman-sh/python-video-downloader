const showToast = (message, duration = 3000) => {
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="removeToast(this.parentElement)">&times;</button>
    `;
    document.getElementById('toast-container').appendChild(toast)

    setTimeout(() => {
        toast.classList.add('show');
    }, 100)

    setTimeout(() => {
        removeToast(toast)
    }, duration)
};

const removeToast = (toast) => {
    toast.classList.remove('show')
    toast.classList.add('hide')
    
    setTimeout(() => {
        toast.remove()
    }, 500)
}

window.addEventListener('load', () => {
    htmx.ajax('GET', '/home', { target: '#main' });
});

document.addEventListener('htmx:configRequest', () => {
    const submitButton = document.querySelector('.btn-submit')
    submitButton.classList.add('loading-active')    
});

document.addEventListener('htmx:afterRequest', () => {
    const submitButton = document.querySelector('.btn-submit'); 
    submitButton.classList.remove('loading-active')
});

const download = async (url, title, ext, button) => {
    const loader = button.querySelector('.loader')
    const buttonText = button.querySelector('.button-text')
    const loadingBar = button.querySelector('.loading')

    buttonText.style.display = 'none';
    loader.style.display = 'inline-block'
    loader.textContent = '0%';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            showToast(`Download failed with error: ${response.statusText}`)
            loader.textContent = 'Error'
            return
        }

        const contentLength = response.headers.get('content-length')
        if (!contentLength) throw new Error('Content-Length header is missing')

        const total = parseInt(contentLength, 10);
        let loaded = 0;

        const reader = response.body.getReader();
        const stream = new ReadableStream({
            start(controller) {
                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close()
                            showToast("Download complete!")
                            return
                        }
                        loaded += value.length;
                        const percent = Math.round((loaded / total) * 100)
                        loader.textContent = `${percent}%`
                        loadingBar.style.width = `${percent}%`
                        controller.enqueue(value)
                        read()
                    }).catch(error => {
                        console.error('Stream error:', error)
                        controller.error(error)
                        showToast(`Stream error: ${error.message}`)
                    });
                }
                read();
            }
        });

        const responseStream = new Response(stream)
        const blob = await responseStream.blob()
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${title}.${ext}`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(downloadUrl)
        loader.textContent = 'Success'
        loadingBar.style.width = '100%'

        setTimeout(() => {
            loader.style.display = 'none'
            buttonText.style.display = 'inline-block'
            loadingBar.style.width = '0'
        }, 1500);

    } catch (error) {
        console.error('Download error:', error);
        loader.textContent = 'Redirecting...'
        showToast("Download failed. Opening in a new tab.")
        window.open(url, '_blank')
    }
}

const paste = async () => {
    try {
        document.querySelector('#input-url').value = await navigator.clipboard.readText()
        showToast("URL pasted from clipboard!")
    } catch (e) {
        console.error(`Error : ${e}`);
        showToast("Failed to paste from clipboard.")
    }
}
