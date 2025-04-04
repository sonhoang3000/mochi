from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Cấu hình
MODEL_PATH = "./fake_news_model.h5"
TOKENIZER_PATH = "./tokenizer.pkl"
MAX_LEN = 500  # Độ dài tối đa của chuỗi
PORT = 5000  # Cổng chạy Flask

# Khởi tạo Flask
app = Flask(__name__)

# Load mô hình và tokenizer
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(TOKENIZER_PATH, "rb") as f:
        tokenizer = pickle.load(f)
    print("Mô hình & Tokenizer đã load thành công!")
except Exception as e:
    print(f" Lỗi khi load mô hình: {e}")
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()
        
        if not text:
            return jsonify({"error": "Vui lòng cung cấp văn bản hợp lệ."}), 400
        
        print(f"📥 Input: {text}")  # Log đầu vào
        
        # Chuyển văn bản thành vector
        sequence = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequence, maxlen=MAX_LEN, padding='post')
        
        # Dự đoán
        prediction = model.predict(padded)[0][0]

        if prediction > 0.6:
            label = "Tin thật (Vô tư đi! Tin này sự thật <3)"
            color = "green"
        else:
            label = "Tin giả (Bạn phải cân nhắc và chọn lựa thông tin chính xác hơn)"
            color = "red"

        print(f" Kết quả: {label} | Xác suất: {prediction:.4f}")  # Log kết quả

        return jsonify({
            "prediction": label,
            "confidence": float(prediction),
            "color": color
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)    