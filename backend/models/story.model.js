import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
      caption: { type: String, default: '' },
      src: { type: String, required: true },  // Lưu URL file (ảnh/video)
      typeContent: { type: String, required: true }, // "image" hoặc "video"
      views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export const Story = mongoose.model('Story', storySchema);
