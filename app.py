from flask import *
from flask_cors import CORS
from ydl import getMD, _load
from helper import _load, _clear_json, add_entry

app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('partials/home.html')

@app.route('/info', methods=['POST'])
def info():
    url = request.form.get('url')
    history = _load('data/history.json')
    
    if not url:
        return jsonify({'error': "Please enter a URL"}), 400
    
    if url in history:
        video_info = history[url]
    else:
        video_info = getMD(url)
        if "error" in video_info:
            return jsonify({'error': video_info['error']}), 400
        add_entry('data/history.json', url, video_info)

    return render_template('partials/info.html', info=video_info)

@app.route('/history')
def history():
    history_info = _load('data/history.json')
    return render_template('partials/history.html', history = history_info)

@app.route('/clear-history')
def clear_history():
    _clear_json('data/history.json')
    return render_template('partials/clearhistory.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='80', debug=True, threaded=True)