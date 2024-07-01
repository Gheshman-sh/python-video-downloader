@echo off
echo Installing yt-dlp...
pip install -U --pre "yt-dlp[default]"
echo.
echo Installing bottle-websocket and eel...
pip install bottle-websocket eel
echo.
echo Installation complete.
pause
