from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image

app = Flask(__name__)

# Load model đã được huấn luyện
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'porn_detection_model.h5')
model = load_model(MODEL_PATH)

# Các nhãn của mô hình
class_names = ['safe', 'porn']

# Route cho việc xử lý ảnh
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file:
        try:
            # Load ảnh và xử lý về kích thước phù hợp với model
            img = Image.open(file).convert('RGB')
            img = img.resize((224, 224))  # Resize về kích thước input của model
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) / 255.0

            # Dự đoán
            prediction = model.predict(img_array)
            predicted_class = class_names[np.argmax(prediction)]
            confidence = float(np.max(prediction))

            # Trả kết quả dưới dạng JSON
            response = {
                'class': predicted_class,
                'confidence': confidence
            }
            return jsonify(response)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file'}), 400

if __name__ == '__main__':
    app.run(debug=True)
