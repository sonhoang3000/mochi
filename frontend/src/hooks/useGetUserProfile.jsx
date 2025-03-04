import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setUserProfile } from '@/redux/authSlice'
import { getProfile } from "@/services/userService"


const useGetUserProfile = (userId) => {
      const dispatch = useDispatch()
      useEffect(() => {
            const fetchUserProfile = async () => {
                  try {
                        const res = await getProfile(userId)
                        if (res.success) {
                              dispatch(setUserProfile(res.user))
                        }
                  } catch (error) {
                        console.log(error)
                  }
            }
            fetchUserProfile()
      }, [userId])
}
export default useGetUserProfile