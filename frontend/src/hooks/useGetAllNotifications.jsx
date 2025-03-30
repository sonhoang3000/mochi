import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setActionNotification } from '@/redux/rtnSlice'
import { getAllNotificationsService } from '@/services/notificationService'

const useGetAllNotifications = () => {
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

export default useGetAllNotifications