import pandas as pd
import numpy as np
import tensorflow as tf
import re
import string
import pickle
<<<<<<< HEAD
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Danh sách stopwords tiếng Việt
STOPWORDS_VIET = set([
    'và', 'là', 'của', 'để', 'có', 'với', 'trong', 'theo', 'cũng', 'lại', 'mà',
    'này', 'nói', 'khi', 'các', 'từ', 'một', 'bao', 'không', 'thì', 'đã', 'chúng',
    'nhiều', 'bạn', 'thế', 'chưa', 'được', 'vì', 'sẽ', 'tôi', 'đi', 'lúc', 'các',
    'này', 'có', 'những', 'có thể', 'đây', 'như', 'tôi', 'từ'
])

# Cấu hình
MAX_WORDS, MAX_LEN = 20000, 500
MODEL_PATH, TOKENIZER_PATH = "fake_news_model.h5", "tokenizer.pkl"

# Đọc dữ liệu
df = pd.read_csv("/content/fakenexmai.csv")[['text', 'label']].dropna()

# Hàm làm sạch văn bản
def clean_text(text):
    text = re.sub(r'\d+|['+string.punctuation+']', '', text.lower())  # Loại bỏ dấu câu và số
    return ' '.join(w for w in text.split() if w not in STOPWORDS_VIET)  # Loại bỏ stopwords

df['text'] = df['text'].apply(clean_text)

# Tokenizer
tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(df['text'])
sequences = pad_sequences(tokenizer.texts_to_sequences(df['text']), maxlen=MAX_LEN, padding='post')

# Chuyển đổi nhãn văn bản thành nhãn số (0 hoặc 1)
df['label'] = df['label'].map({'sai': 0, 'đúng': 1})

# Chia dữ liệu thành training và testing
X_train, X_test, y_train, y_test = train_test_split(sequences, df['label'], test_size=0.2, random_state=42, stratify=df['label'])

# Chuyển đổi dữ liệu thành numpy arrays
X_train = np.array(X_train)
y_train = np.array(y_train)
X_test = np.array(X_test)
y_test = np.array(y_test)

# Lưu tokenizer
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
=======
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split

MAX_WORDS = 20000  # Số từ tối đa trong từ điển
MAX_LEN = 500 
MODEL_PATH = "fake_news_model.h5"
TOKENIZER_PATH = "tokenizer.pkl"

df = pd.read_csv("WELFake_Dataset.csv")[['text', 'label']].dropna()

STOPWORDS = set(["the", "a", "an", "is", "in", "at", "of", "for", "on", "and", "with", "to", "this", "that", "it", "by", "from", "be", "was", "were", "will", "has", "have", "had"])

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text) 
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = ' '.join([word for word in text.split() if word not in STOPWORDS])  
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['text'] = df['text'].apply(clean_text)

tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(df['text'])
sequences = tokenizer.texts_to_sequences(df['text'])
padded = pad_sequences(sequences, maxlen=MAX_LEN, padding='post')

X_train, X_test, y_train, y_test = train_test_split(padded, df['label'], test_size=0.2, random_state=42, stratify=df['label'])

with open(TOKENIZER_PATH, "wb") as f:
    pickle.dump(tokenizer, f)

model = tf.keras.Sequential([
    tf.keras.layers.Embedding(MAX_WORDS, 256, input_length=MAX_LEN),
    tf.keras.layers.Conv1D(128, 5, activation='relu'),
    tf.keras.layers.MaxPooling1D(pool_size=2),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(128, return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.GRU(64)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.4),  
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

<<<<<<< HEAD
# Biên dịch mô hình
model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(0.0002), metrics=['accuracy'])

# Callback
callbacks = [
    tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6),
    tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss', mode='min')
]

# Huấn luyện mô hình
model.fit(X_train, y_train, epochs=12, batch_size=64, validation_data=(X_test, y_test), callbacks=callbacks)

# Lưu mô hình
model.save(MODEL_PATH)
print("Mô hình đã được lưu thành công!")

# Đánh giá mô hình
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Độ chính xác của mô hình: {accuracy * 100:.2f}%")
=======
model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002), metrics=['accuracy'])

early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6)
model_checkpoint = tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss', mode='min')

model.fit(X_train, y_train, epochs=12, batch_size=64, validation_data=(X_test, y_test), callbacks=[early_stopping, reduce_lr, model_checkpoint])

model.save(MODEL_PATH)
print(" Mô hình đã được lưu thành công!")
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
