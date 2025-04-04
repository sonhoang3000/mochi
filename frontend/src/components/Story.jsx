import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Story = () => {
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState(null);
  const autoPlayTimer = useRef(null); // Sử dụng useRef để tránh lỗi văng

  // Lấy danh sách Story
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/story/follow", { withCredentials: true })
      .then((response) => setStories(response.data.stories || []))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const handleViewStory = (index) => {
    if (index < 0 || index >= stories.length) return;

    setActiveStoryIndex(index);
    axios.put(`http://localhost:8000/api/v1/story/view/${stories[index]._id}`, {}, { withCredentials: true })
      .catch((error) => console.error("Error viewing story:", error));

    fetchComments(stories[index]._id);

    // Xóa timer cũ trước khi tạo mới
    if (autoPlayTimer.current) {
      clearTimeout(autoPlayTimer.current);
    }

    autoPlayTimer.current = setTimeout(() => {
      handleNextStory();
    }, 5000);
  };

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => clearTimeout(autoPlayTimer.current);
  }, []);

  // Chuyển story kế tiếp
  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      handleViewStory(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  // Quay lại story trước
  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      handleViewStory(activeStoryIndex - 1);
    }
  };

  // Lấy bình luận của Story
  const fetchComments = (storyId) => {
    axios.get(`http://localhost:8000/api/v1/story/${storyId}/getcomments`, { withCredentials: true })
      .then((response) => setComments(response.data.comments || []))
      .catch((error) => console.error("Error fetching comments:", error));
  };

  const handleCommentStory = async (event) => {
    event.preventDefault(); // Ngăn chặn form bị reload trang

    if (!newComment.trim() || activeStoryIndex === null) return;

    const storyId = stories[activeStoryIndex]._id;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/story/comment/${storyId}`,
        { text: newComment },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setNewComment("");
        fetchComments(storyId); // Cập nhật lại danh sách bình luận
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  // Thích / Bỏ thích Story
  const handleLikeStory = () => {
    if (activeStoryIndex === null) return;
    const storyId = stories[activeStoryIndex]._id;
    axios.put(`http://localhost:8000/api/v1/story/${storyId}/likeordislike`, {}, { withCredentials: true })
      .then(() => console.log("Story liked/disliked"))
      .catch((error) => console.error("Error liking/disliking story:", error));
  };

  // Upload Story mới
  const handleUploadStory = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    axios.post("http://localhost:8000/api/v1/story/upload", formData, { withCredentials: true })
      .then(() => {
        setFile(null);
        window.location.reload();
      })
      .catch((error) => console.error("Error uploading story:", error));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px", backgroundColor: "#fff" }}>
      
      {/* Nút tải lên Story */}
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <button 
          onClick={handleUploadStory} 
          style={{ fontSize: "24px", padding: "5px 10px", borderRadius: "50%", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
        >
          +
        </button>
      </div>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "10px", width: "100%", maxWidth: "600px", scrollbarWidth: "none" }}>
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <div key={story._id} style={{ textAlign: "center" }}>
              <div 
                onClick={() => handleViewStory(index)}
                style={{ 
                  width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden", cursor: "pointer",
                  border: "3px solid #ff4500", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <img src={story.user?.avatarUrl || "default-avatar.png"} alt="User Avatar" 
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#333", marginTop: "5px", fontWeight: "bold" }}>
                {story.user?.username || "Người dùng"}
              </p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#999", textAlign: "center" }}>Không có story nào!</p>
        )}
      </div>

      {/* Hiển thị Story */}
      {activeStoryIndex !== null && (
        <div 
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}
      >
        {/* Bắt sự kiện đóng Story khi bấm vào vùng ngoài */}
        <div style={{ position: "absolute", width: "100%", height: "100%" }} onClick={() => setActiveStoryIndex(null)}></div>
      
        {/* Hiển thị nội dung Story */}
        <div style={{ position: "relative", zIndex: 1001 }}>
          <button onClick={handlePrevStory}>{"<"}</button>
          <img 
  src={stories[activeStoryIndex].src || stories[activeStoryIndex].imageUrl} 
  alt="Story" 
  style={{ 
    width: "auto", 
    height: "80vh", 
    maxWidth: "90vw",
    borderRadius: "10px",
    objectFit: "cover", 
    aspectRatio: "9 / 16" 
  }} 
/>

          <button onClick={handleNextStory}>{">"}</button>
      
          <button onClick={handleLikeStory}>❤️ Thích</button>
      
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Nhập bình luận" />
          <button onClick={handleCommentStory}>Bình luận</button>
      
          {comments.map((comment) => (
            <p key={comment._id}>{comment.text}</p>
          ))}
        </div>
      </div>
      
      )}
    </div>
  );
};

export default Story;
