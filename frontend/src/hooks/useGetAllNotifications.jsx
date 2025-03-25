
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setLikeNotification, setCommentNotification } from '@/redux/rtnSlice'
import { getAllNotificationsService } from '@/services/notificationService'

const useGetAllNotifications = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchAllNotifications = async () => {
			try {
				const res = await getAllNotificationsService()
				if (res.success) {
					const likeNotification = res.notifications.filter(notification => notification.type === 'like') || []
					const commentNotification = res.notifications.filter(notification => notification.type === 'comment') || []

                    dispatch(setLikeNotification(likeNotification))
                    dispatch(setCommentNotification(commentNotification))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllNotifications()
	}, [])
}
export default useGetAllNotifications