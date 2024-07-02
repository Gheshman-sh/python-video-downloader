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
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        "format": "best",
        "noplaylist": True,
        'n_threads': 8,
        'buffer_size': '16M',
        'retries': 10,
        'throttled_rate': None,
        'http_chunk_size': '10M',
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
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'format': f'bestvideo[ext={ext}][height<={resolution}]+bestaudio[ext={ext}]/best[ext={ext}]/best',
            'outtmpl': os.path.join(downloads_folder, '%(title)s.%(ext)s'),
            'progress_hooks': [progress_hook],
            'n_threads': 8,
            'buffer_size': '16M',
            'retries': 10,
            'throttled_rate': None,
        }

        with yt.YoutubeDL(yt_dlp_options) as _yt:
            _yt.download([url])

        return "Download completed successfully"
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}"

eel.start("index.html", size=(1200, 800))