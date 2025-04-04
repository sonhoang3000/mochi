import { Notification } from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ receiverId: userId })
            .populate('senderId', 'username profilePicture')
            .populate({
                path: 'postId',
                populate: [
                    {
                        path: 'author',
                        select: 'username profilePicture _id'
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: 'username profilePicture'
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Get notifications successfully',
			notifications,
			success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
<<<<<<< HEAD
        );

        console.log("Notification ID to mark as read:", req.params.id);
        
=======
        );        
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
        res.status(200).json({
            success: true,
            notification
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}