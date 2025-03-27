import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['like', 'dislike', 'comment'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người thực hiện hành động (người gửi thông báo)
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận thông báo
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', notificationSchema);
