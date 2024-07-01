import eel
import os
import pathlib
import time
import yt_dlp as yt
eel.init("web")

def progress_hook(d):
    if d['status'] == 'downloading':
        eel.updateProgress(d)

@eel.expose()
def getVideo(url):
    yt_dlp_options = {
        "format": "best",
        "noplaylist": True
    }
    
    retry_attempts = 3
    
    for attempt in range(retry_attempts):
        try:
            with yt.YoutubeDL(yt_dlp_options) as _yt:
                video_info = _yt.extract_info(url, download=False)
                print("Results fetched successfully")
                return video_info
        except yt.utils.DownloadError as err:
            if attempt < retry_attempts - 1:
                time.sleep(2)
                continue
            else:
                print("An Error Occurred file fetching Data")
                return "An Error Occurred file fetching Data"

@eel.expose()
def downloadVideo(url, ext, resolution):
    try:
        downloads_folder = str(pathlib.Path.home() / "Downloads/VideoDownloader")
        
        if not os.path.exists(downloads_folder):
            os.makedirs(downloads_folder)

        yt_dlp_options = {
            'format': f'bestvideo[ext={ext}][height<={resolution}]+bestaudio[ext={ext}]/best[ext={ext}]/best',
            'outtmpl': os.path.join(downloads_folder, '%(title)s.%(ext)s'),
            'progress_hooks': [progress_hook]
        }

        with yt.YoutubeDL(yt_dlp_options) as _yt:
            _yt.download([url])

        return "Download completed successfully"
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}"

eel.start("index.html", size=(1200, 800))