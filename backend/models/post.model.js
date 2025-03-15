import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
      caption: { type: String, default: '' },
      src: { type: String, required: true },
      typeContent: { type: String, required: true },
      tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);