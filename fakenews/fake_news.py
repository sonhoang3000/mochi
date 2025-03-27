import pandas as pd
import numpy as np
import tensorflow as tf
import re
import string
import pickle
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
    tf.keras.layers.Embedding(MAX_WORDS, 256, input_length=MAX_LEN),  # Chuyển từ thành vector
    
    tf.keras.layers.Conv1D(128, 5, activation='relu'),  # Mạng CNN để trích xuất đặc trưng
    tf.keras.layers.MaxPooling1D(pool_size=2),  # Giảm kích thước dữ liệu
    
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(128, return_sequences=True)),  # Bi-LSTM học ngữ cảnh hai chiều
    tf.keras.layers.Bidirectional(tf.keras.layers.GRU(64)),  # Bi-GRU giúp ghi nhớ thông tin quan trọng
    
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.4),

    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(1, activation='sigmoid')  # Lớp đầu ra (Phân loại tin thật/tin giả)
])

model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002), metrics=['accuracy'])

early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6)
model_checkpoint = tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_loss', mode='min')

model.fit(X_train, y_train, epochs=12, batch_size=64, validation_data=(X_test, y_test), callbacks=[early_stopping, reduce_lr, model_checkpoint])

model.save(MODEL_PATH)
print(" Mô hình đã được lưu thành công!")
