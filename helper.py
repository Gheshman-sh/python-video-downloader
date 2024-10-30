import json

def _load(filename):
    with open(filename, 'r') as file:
        return json.load(file)
    
def _clear_json(filename):
    with open(filename, 'w') as file:
        json.dump({}, file)

def add_entry(filename, key, value):
    data = _load(filename)
    data[key] = value
    
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)