import { setActionNotification } from '@/redux/rtnSlice'
import { getAllNotificationsService } from '@/services/notificationService'
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllNotifications = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchAllNotifications = async () => {
			try {
				const res = await getAllNotificationsService()
				if (res.success) {
					const actionNotification = res.notifications

                    dispatch(setActionNotification(actionNotification))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllNotifications()
	}, [])
}
export default useGetAllNotifications