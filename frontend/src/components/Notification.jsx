import { setSelectedPost } from "@/redux/postSlice";
import { setActionNotification } from "@/redux/rtnSlice";
import { markAsRead } from "@/services/notificationService";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentDialog from "./CommentDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const Notification = ({ open, setOpen }) => {
    const { actionNotification } = useSelector(store => store.realTimeNotification)
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const markAllAsRead = async () => {
            if (open) {
                const unreadNotifications = [
                    ...(actionNotification || [])
                ].filter(notification => !notification.isRead);

                try {
                    await Promise.all(
                        unreadNotifications.map(notification => 
                            markAsRead(notification._id)
                        )
                    );
                    
                    const updatedNotifications = actionNotification.map(notification => ({
                        ...notification,
                        isRead: true
                    }));
                    dispatch(setActionNotification(updatedNotifications));
                } catch (error) {
                    console.error("Error marking notifications as read:", error);
                }
            }
        };

        markAllAsRead();
    }, [open]);

    const handlePostClick = (post) => {
        const postWithComments = {
            ...post,
            // comments: post.comments || []
        };
        dispatch(setSelectedPost(postWithComments));
        setCommentDialogOpen(true);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Notification</DialogTitle>
                    </DialogHeader>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {Array.isArray(actionNotification) && actionNotification.map(notification => (
                            <div key={notification._id} className="flex items-center gap-3 p-3 border-b hover:bg-gray-50">
                                {/* Avatar của người gửi */}
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={notification.senderId.profilePicture || "../assets/avatar.jpg"}
                                        alt={notification.senderId.username}
                                        className="w-full h-full object-cover "
                                    />
                                </div>

                                {/* Thông tin notification */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {/* <span className="font-semibold">{notification.senderId.username}</span> */}
                                        <span className="text-gray-600">{notification.message}</span>
                                    </div>

                                    {/* Thời gian */}
                                    <div className="text-sm text-gray-500">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {/* Preview ảnh bài post */}
                                <div className="w-12 h-12 rounded overflow-hidden">
                                    <img
                                        src={notification.postId.src}
                                        alt={notification.postId.caption}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => handlePostClick(notification.postId)}
                                    />
                                </div>

                                {/* Indicator cho notification chưa đọc */}
                                {!notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                )}
                            </div>
                        ))}

                    </div>
                </DialogContent>
            </Dialog>
            <CommentDialog open={commentDialogOpen} setOpen={setCommentDialogOpen} />
        </>
    )
}

Notification.propTypes = {
    open: PropTypes.bool.isRequired, // 'open' là boolean và bắt buộc
    setOpen: PropTypes.func.isRequired, // 'setOpen' là một hàm và bắt buộc
};

export default Notification