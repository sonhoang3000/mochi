import { useState } from "react";

const FakeNewsChecker = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/ai/fakenew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gửi yêu cầu kiểm tra tin tức.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
         Kiểm Tra Tin Giả
      </h1>

      <textarea
        className="w-full border p-3 rounded-md shadow-sm focus:ring focus:ring-blue-200"
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập nội dung cần kiểm tra..."
      />

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition"
        onClick={handleCheck}
        disabled={!text} // Vô hiệu hóa nút nếu không có văn bản
      >
        Kiểm tra Fake News
      </button>

      {error && (
        <p className="mt-4 text-red-500 font-semibold">Lỗi: {error}</p>
      )}

      {result && (
        <p
          className={`mt-6 font-semibold text-lg border-l-4 p-4 rounded shadow-md
            ${
              result.color === "red"
                ? "border-red-500 bg-red-100 text-red-700"
                : "border-green-500 bg-green-100 text-green-700"
            }
          `}
        >
          <strong>Kết quả:</strong> {result.prediction}
          <br />
          <strong>Xác suất:</strong> {(result.confidence * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
};

export default FakeNewsChecker;
