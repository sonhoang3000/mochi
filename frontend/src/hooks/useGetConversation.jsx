import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { setGetConversation } from '@/redux/authSlice'
import { getConversationService } from "@/services/userService"

const useGetConversation = () => {
      const dispatch = useDispatch()
      const [time, setTime] = useState("")

      useEffect(() => {
            const fetchConversation = async () => {
                  try {
                        const res = await getConversationService()
                        const conversations = res.conversations;
                        const participantsList = conversations.map(conv => conv.participants).flat();

                        setTime(conversations.updatedAt)
                        if (res.success) {
                              dispatch(setGetConversation(participantsList))
                        }
                  } catch (error) {
                        console.log(error)
                  }
            }
            fetchConversation()
      }, [time])
}
export default useGetConversation