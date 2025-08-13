import os
from flask import Flask, request, jsonify, render_template_string
from werkzeug.utils import secure_filename
import parser
import comparator

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Checks if the uploaded file has a .pdf extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Serves the main HTML page."""
    # We will load the HTML content from the file you have.
    # For this to work, create a 'templates' folder in your project
    # and place your 'index.html' file inside it.
    try:
        with open('templates/index.html', 'r') as f:
            html_content = f.read()
        return render_template_string(html_content)
    except FileNotFoundError:
        return "Error: index.html not found. Please create a 'templates' folder and add your HTML file.", 404


@app.route('/compare', methods=['POST'])
def compare_quotes():
    """
    API endpoint to upload two PDFs, parse them, compare them,
    and return the results as JSON.
    """
    # Check if the post request has the file part
    if 'quote1' not in request.files or 'quote2' not in request.files:
        return jsonify({"error": "Missing one or both quote files"}), 400

    file1 = request.files['quote1']
    file2 = request.files['quote2']

    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file1 and allowed_file(file1.filename) and file2 and allowed_file(file2.filename):
        # Secure filenames and save the files
        filename1 = secure_filename(file1.filename)
        filename2 = secure_filename(file2.filename)
        filepath1 = os.path.join(app.config['UPLOAD_FOLDER'], filename1)
        filepath2 = os.path.join(app.config['UPLOAD_FOLDER'], filename2)
        file1.save(filepath1)
        file2.save(filepath2)

        try:
            # Use your existing parser to extract data
            # Assuming the parser returns a dictionary or an object
            data1 = parser.parse_quote(filepath1)
            data2 = parser.parse_quote(filepath2)

            # Use your existing comparator to get the comparison
            # This will need to be adapted to return structured data (dict/JSON)
            # instead of a markdown string.
            comparison_results = comparator.compare_quotes_as_json(data1, data2) # We'll need to create this function

            # Clean up uploaded files after processing
            os.remove(filepath1)
            os.remove(filepath2)
            
            # Return the structured comparison data
            return jsonify(comparison_results)

        except Exception as e:
            # Clean up in case of error
            if os.path.exists(filepath1):
                os.remove(filepath1)
            if os.path.exists(filepath2):
                os.remove(filepath2)
            return jsonify({"error": f"An error occurred during processing: {str(e)}"}), 500
    
    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)

