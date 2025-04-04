import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profilePicture: { type: String, default: 'https://res.cloudinary.com/dybo8zd4y/image/upload/v1742839962/lyed4grcpvdk0pndgzzt.jpg' },
      bio: { type: String, default: '' },
      gender: { type: String, enum: ['male', 'female'] },
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
      bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
      stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
      notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);