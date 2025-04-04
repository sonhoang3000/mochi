<<<<<<< HEAD

=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setActionNotification } from '@/redux/rtnSlice'
import { getAllNotificationsService } from '@/services/notificationService'

const useGetAllNotifications = () => {
<<<<<<< HEAD
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
=======
    const dispatch = useDispatch()

    const fetchAllNotifications = async () => {
        try {
            const res = await getAllNotificationsService()
            if (res.success) {
                dispatch(setActionNotification(res.notifications))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllNotifications()
    }, [])

    // Return function để có thể gọi refresh khi cần
    return { refreshNotifications: fetchAllNotifications }
}

>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
export default useGetAllNotifications