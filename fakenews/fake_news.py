import pandas as pd
import numpy as np
import tensorflow as tf
import re
import string
import pickle
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences


# Cấu hình
MAX_WORDS, MAX_LEN = 20000, 500
MODEL_PATH, TOKENIZER_PATH = "fake_news_model.h5", "tokenizer.pkl"

df = pd.read_csv("./fakenexmai.csv")[['text', 'label']].dropna()

# Danh sách bỏ i
STOPWORDS_VIET = set([
    'và', 'là', 'của', 'để', 'có', 'với', 'trong', 'theo', 'cũng', 'lại', 'mà',
    'này', 'nói', 'khi', 'các', 'từ', 'một', 'bao', 'không', 'thì', 'đã', 'chúng',
    'nhiều', 'bạn', 'thế', 'chưa', 'được', 'vì', 'sẽ', 'tôi', 'đi', 'lúc', 'các',
    'này', 'có', 'những', 'có thể', 'đây', 'như', 'tôi', 'từ'
])

# Hàm làm sạch văn bản
def clean_text(text):
    text = re.sub(r'\d+|['+string.punctuation+']', '', text.lower())  
    return ' '.join(w for w in text.split() if w not in STOPWORDS_VIET) 

df['text'] = df['text'].apply(clean_text)

# Tokenizer
tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(df['text'])
sequences = pad_sequences(tokenizer.texts_to_sequences(df['text']), maxlen=MAX_LEN, padding='post')

# Chuyển đổi nhãn văn bản thành nhãn số (0 hoặc 1)
df['label'] = df['label'].map({'sai': 0, 'đúng': 1})

# Chia dữ liệu thành training và testing
X_train, X_test, y_train, y_test = train_test_split(
    sequences, 
    df['label'], 
    test_size=0.2,       # 20% dữ liệu test
    random_state=42,     # Giữ kết quả chia ổn định giữa các lần chạy
    stratify=df['label']
)

# Chuyển đổi dữ liệu thành numpy arrays
X_train = np.array(X_train)
y_train = np.array(y_train)
X_test = np.array(X_test)
y_test = np.array(y_test)

with open(TOKENIZER_PATH, "wb") as f: pickle.dump(tokenizer, f)

# Kiểm tra xem nhãn có cần phải chuyển đổi không
y_train = y_train.astype(int)
y_test = y_test.astype(int)

# Mô hình sử dụng LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(MAX_WORDS, 128),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(128, return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.4),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Biên dịch mô hình
model.compile(
    loss='binary_crossentropy',                    # Hàm mất mát cho bài toán nhị phân
    optimizer=tf.keras.optimizers.Adam(0.0002),    # Tối ưu Adam, học chậm giúp ổn định
    metrics=['accuracy']                           # Đánh giá bằng độ chính xác
)

# Callback
callbacks = [
    tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6),
    tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss', mode='min')
]

# Huấn luyện mô hình
model.fit(
    X_train, y_train,
    epochs=12,                       # Số vòng lặp qua toàn bộ dữ liệu
    batch_size=64,                # 10000 dòng/64 = 157 lần cập nhật
    validation_data=(X_test, y_test),  # Dùng dữ liệu test để theo dõi hiệu suất
    callbacks=callbacks             # Dừng sớm, giảm tốc độ học, lưu mô hình tốt nhất
)


model.save(MODEL_PATH)
print("Mô hình đã được lưu thành công!")

# Đánh giá mô hình
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Độ chính xác của mô hình: {accuracy * 100:.2f}%")
