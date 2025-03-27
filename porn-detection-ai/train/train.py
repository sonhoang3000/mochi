import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Đường dẫn tới dataset
dataset_dir = "../dataset"

# Load dataset và xác định class_names theo thứ tự mong muốn
train_ds_raw = keras.preprocessing.image_dataset_from_directory(
    f"{dataset_dir}/train", 
    image_size=(224, 224), 
    batch_size=32,
    class_names=['safe', 'porn']  # Đảm bảo thứ tự nhãn: safe = 0, porn = 1
)

val_ds_raw = keras.preprocessing.image_dataset_from_directory(
    f"{dataset_dir}/val", 
    image_size=(224, 224), 
    batch_size=32,
    class_names=['safe', 'porn']  # Đảm bảo thứ tự nhãn: safe = 0, porn = 1
)

# Kiểm tra class_names để xác nhận thứ tự nhãn
class_names = train_ds_raw.class_names
print(f"Class names: {class_names}")

# Chuẩn hóa dữ liệu (Rescale từ 0-255 về 0-1)
normalization_layer = layers.Rescaling(1./255)
train_ds = train_ds_raw.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds_raw.map(lambda x, y: (normalization_layer(x), y))

# Tối ưu hóa hiệu suất khi huấn luyện
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# Xây dựng mô hình CNN
model = keras.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    layers.MaxPooling2D(2,2),
    
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    
    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    
    layers.Conv2D(256, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),  # Thêm Dropout để tránh overfitting
    layers.Dense(2, activation='softmax')  # 2 lớp cho 2 nhãn
])

# Compile mô hình
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),  # Hạ learning rate để tăng độ chính xác
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Huấn luyện mô hình
EPOCHS = 10
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
)

# Lưu mô hình
model.save("../model/porn_detection_model.h5")
print("✅ Model đã được lưu tại ../model/porn_detection_model.h5")

# Đánh giá mô hình
test_loss, test_acc = model.evaluate(val_ds)
print(f"✅ Độ chính xác của mô hình: {test_acc:.2%}")
