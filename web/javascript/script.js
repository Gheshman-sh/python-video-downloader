const Proceed = document.querySelector("#proceed")
const log = document.querySelector(".log")
const progress = document.querySelector(".progress")
const downloads_status = document.querySelector(".downloads_status")
let _url
let _title

Proceed.addEventListener("click", async () => {
    const url = document.querySelector("#Url").value
    
    if(url) {
        try {
            downloads_status.innerHTML = ""
            progress.innerHTML = ""
            _url = url
            log.innerHTML = "Fetching results from the video: '" + url + "'<br>"
            log.innerHTML += "please be patient <br>"
            const videoInfo = await eel.getVideo(url)()
            console.log(videoInfo)
            log.innerHTML += "Results fetched successfully<br>"
        
            const video_container = document.querySelector(".video")
            video_container.style.visibility = "visible";
        
            const thumbnail = document.querySelector("#thumbnail_img")
            const title = document.querySelector(".title")
            const author = document.querySelector(".author")
            const views = document.querySelector(".views")
            const likes = document.querySelector(".likes")
            const dislikes = document.querySelector(".dislikes")
        
            thumbnail.src = videoInfo.thumbnail
            title.innerText = videoInfo.title
            author.innerText = videoInfo.uploader
            views.innerText = videoInfo.view_count + " views"
            likes.innerText = (videoInfo.like_count || 'N/A') + " likes"
            dislikes.innerText = (videoInfo.comment_count || 'N/A') + " comments"
            url.value = ""
            _title = videoInfo.title
          } catch (err) {
            console.error("Error fetching video info:", err)
            const log = document.querySelector(".log")
            log.innerHTML += "Error fetching video info<br>"
          }
    } else {
        log.innerHTML = "Please enter url"
    }
});

async function download( resolution, ext) {
    try {
        progress.innerHTML = ''
        downloads_status.innerHTML = `downloading of \"${_title}.${ext}\" has been started <br>`
        downloads_status.innerHTML += "please be patient"
        const result = await eel.downloadVideo(_url, ext, resolution)();
        progress.innerHTML += "download Completed"
    } catch (err) {
        console.error("Error downloading video:", err);
        log.innerHTML += "Error downloading video<br>";
    }
}

function stripAnsi(str) {
    const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return str.replace(ansiRegex, '');
}

function updateProgress(d) {
    let progress_data = stripAnsi(d._default_template)
    progress.innerHTML = progress_data + "<br>"
}

eel.expose(updateProgress);