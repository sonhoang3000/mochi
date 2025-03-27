import os
import tensorflow as tf
from tensorflow import keras

model = keras.models.load_model("../model/porn_detection_model.h5")

model.compile(
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

dataset_dir = "../dataset/test"

def is_valid_image_tf(file_path):
    """Kiểm tra xem ảnh có thể đọc được bằng TensorFlow không"""
    try:
        img = tf.io.read_file(file_path)
        img = tf.io.decode_jpeg(img, channels=3)  # Nếu PNG thì đổi sang decode_png
        return True
    except:
        return False  # Ảnh lỗi

image_paths = []
labels = []
label_map = {"safe": 0, "porn": 1}  # Gán nhãn 0 cho safe, 1 cho porn

for category in ["safe", "porn"]:
    category_path = os.path.join(dataset_dir, category)
    if os.path.exists(category_path):
        for file in os.listdir(category_path):
            file_path = os.path.join(category_path, file)
            if file.lower().endswith(('.jpg', '.jpeg', '.png')) and is_valid_image_tf(file_path):
                image_paths.append(file_path)
                labels.append(label_map[category])

print(f"✅ Tổng số ảnh hợp lệ: {len(image_paths)}")

# Load ảnh và chuyển thành tensor
def load_image(image_path, label):
    img = tf.io.read_file(image_path)
    img = tf.io.decode_jpeg(img, channels=3)  # Nếu PNG thì dùng decode_png
    img = tf.image.resize(img, (224, 224))
    img = img / 255.0  # Chuẩn hóa ảnh về [0,1]
    return img, label

test_ds = tf.data.Dataset.from_tensor_slices((image_paths, labels))
test_ds = test_ds.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
test_ds = test_ds.batch(32).prefetch(buffer_size=tf.data.AUTOTUNE)

# Đánh giá model
loss, accuracy = model.evaluate(test_ds)

print(f"🎯 Accuracy trên tập test: {accuracy:.2%}")
print(f"⚠️ Loss trên tập test: {loss:.4f}")
