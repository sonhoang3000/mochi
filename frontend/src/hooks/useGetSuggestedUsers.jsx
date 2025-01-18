import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setSuggestedUsers } from '@/redux/authSlice'
import { getSuggestedUsers } from "@/services/userService"


const useGetSuggestedUsers = () => {
      const dispatch = useDispatch()
      useEffect(() => {
            const fetchSuggestedUsers = async () => {
                  try {
                        const res = await getSuggestedUsers()
                        if (res.success) {
                              dispatch(setSuggestedUsers(res.users))
                        }
                  } catch (error) {
                        console.log(error)
                  }
            }
            fetchSuggestedUsers()
      }, [])
}
export default useGetSuggestedUsers