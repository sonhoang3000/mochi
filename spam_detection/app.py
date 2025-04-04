from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import joblib
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Khởi tạo FastAPI
app = FastAPI()

# Load mô hình đã huấn luyện
model = tf.keras.models.load_model("spam_lstm_model.h5")

# Load tokenizer
tokenizer = joblib.load("tokenizer.pkl")

# Định nghĩa độ dài tối đa của chuỗi đầu vào
max_len = 100

# Định nghĩa kiểu dữ liệu đầu vào
class TextInput(BaseModel):
    text: str

# Endpoint API để kiểm tra tin nhắn spam
@app.post("/spam/")
async def predict_spam(input_data: TextInput):
    try:
        # Chuyển đổi văn bản sang token
        text_seq = pad_sequences(tokenizer.texts_to_sequences([input_data.text]), maxlen=max_len)

        # Dự đoán
        prediction = model.predict(text_seq)[0][0]

        # Xác định nhãn
        label = "Spam" if prediction > 0.5 else "Ham"

        return {"text": input_data.text, "prediction": label, "confidence": float(prediction)}
    except Exception as e:
        return {"error": str(e)}

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5002, reload=True)
