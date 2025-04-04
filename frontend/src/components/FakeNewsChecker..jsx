import { useState } from "react";

const FakeNewsChecker = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:8000/api/v1/ai/fakenew", {
=======
      const response = await fetch("http://localhost:8000/api/v1/ai/check-fake-news", {
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">News Checker</h1>
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
        disabled={loading}
      >
        {loading ? "Đang kiểm tra..." : "Kiểm tra Fake News"}
      </button>

      {error && <p className="mt-4 text-red-500">Lỗi: {error}</p>}

      {result && (
        <p className={`mt-4 font-bold p-3 rounded-lg ${result.prediction === "Fake News" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
<<<<<<< HEAD
          Kết quả: {result.prediction} (Credibility: {result.confidence ? result.confidence.toFixed(2) : "N/A"})
=======
          Kết quả: {result.prediction} (Độ tin cậy: {result.confidence ? result.confidence.toFixed(2) : "N/A"})
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
        </p>
      )}
    </div>
  );
};


export default FakeNewsChecker;