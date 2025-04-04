import tensorflow as tf
import joblib
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load mô hình đã huấn luyện
model = tf.keras.models.load_model("spam_lstm_model.h5")

# Load tokenizer
tokenizer = joblib.load("tokenizer.pkl")

# Định nghĩa lại các tham số
max_len = 100

# Dữ liệu cần dự đoán
new_texts = ["Thật tuyệt vời...!!!", 
             "mỹ đã tuột dốc quá nhiều rồi, giờ muốn vực dậy cũng rất khó", 
             "chet mja"]

# Chuyển đổi văn bản sang dạng token
new_texts_seq = pad_sequences(tokenizer.texts_to_sequences(new_texts), maxlen=max_len)

# Dự đoán với mô hình
predictions = model.predict(new_texts_seq)

# Hiển thị kết quả
for text, pred in zip(new_texts, predictions):
    label = "Spam" if pred > 0.5 else "Ham"
    print(f"Tin nhắn: {text} -> Dự đoán: {label}")
