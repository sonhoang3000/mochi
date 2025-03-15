
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setMessages } from '@/redux/chatSlice'
import { getMessage } from '@/services/messageService'


const useGetAllMessage = () => {
	const dispatch = useDispatch()
	const { selectedUser } = useSelector(store => store.auth)
	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				const res = await getMessage(selectedUser?._id)
				if (res.success) {
					dispatch(setMessages(res.messages))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllMessage()
	}, [selectedUser])
}
export default useGetAllMessage