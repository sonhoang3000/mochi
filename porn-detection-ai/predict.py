import tensorflow as tf
from tensorflow import keras
import numpy as np
import cv2  # Thư viện OpenCV để xử lý ảnh
import sys

# Load model đã train
model = keras.models.load_model("./model/porn_detection_model.h5")

# Danh sách class
class_names = ["Safe", "Porn"]

def predict_image(image_path):
    # Đọc ảnh bằng OpenCV
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Chuyển sang RGB
    img = cv2.resize(img, (224, 224))  # Resize ảnh về 224x224
    img = img / 255.0  # Chuẩn hóa ảnh về [0,1]
    
    # Chuyển đổi ảnh thành tensor
    img_array = np.expand_dims(img, axis=0)

    # Dự đoán
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions[0])
    
    print(f"🖼 Ảnh: {image_path}")
    print(f"📌 Dự đoán: {class_names[predicted_class]}")
    print(f"📊 Xác suất: {predictions[0][predicted_class]:.2%}")

# Nhận đường dẫn ảnh từ tham số dòng lệnh
if len(sys.argv) < 2:
    print("❌ Hãy cung cấp đường dẫn ảnh!")
else:
    image_path = sys.argv[1]
    predict_image(image_path)
