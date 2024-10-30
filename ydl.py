from yt_dlp import YoutubeDL
from urllib.parse import urlparse
from helper import _load

loginCreds = _load('data/login_creds.json')

def getMD(url):
    domain = urlparse(url).netloc
    loginCred = loginCreds.get(domain)
    
    yt_opts = {
        'format': 'bestvideo+bestaudio/best',
        'cookie': '/data/cookie.txt',
        'verbose': True,
        'geo_bypass': True,
        'geo_bypass_country': 'CA',
        'ratelimit': 10 * 1024 * 1024,
        'http_header': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
            'Referer': f'https://{domain}',
        }
    }
    
    if loginCred:
        yt_opts['username'] = loginCred['username']
        yt_opts['password'] = loginCred['password']
        
    try:
        with YoutubeDL(yt_opts) as i:
            info = i.extract_info(url, download=False)
            return info
    except Exception as e:
        return {"error": f"Error while fetching video info: {e}"}