from flask import Flask, render_template, jsonify, request
import os
from libs.utils import allowed_file
from engine.analyzer import extract_transactions

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/hello')
def hello():
    return "Hello world"


@app.route('/hello/<name>')
def greet(name):
    return f'Hello {name}'

@app.route('/analyze')
def analyze():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error':'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error':'No selected file'})
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        transactions = extract_transactions(filepath)
        return jsonify(transactions)
    return jsonify({'error':'file type not allowed'})

if __name__ == '__main__':
    app.run(debug=True)
