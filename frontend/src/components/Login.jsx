import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { loginUser } from '@/services/userService'
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
	const [input, setInput] = useState({
		email: "",
		password: ""
	})
	const [loading, setLoading] = useState(false)
	const { user } = useSelector(store => store.auth)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const changeEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value })
	}

	const loginHandler = async (e) => {
		e.preventDefault()
		try {
			setLoading(true)
			const res = await loginUser(input)
			if (res.success) {
				dispatch(setAuthUser(res.user))
				navigate("/")
				toast.success(res.message)
				setInput({
					email: "",
					password: ""
				})
			}
		} catch (error) {
			console.log('error', error)
			toast.error("Error register", error.response.data.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user)
			navigate('/')
	}, [])


	return (
		<div className='flex items-center w-screen h-screen justify-center'>
			<form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
				<div className='my-4'>
					<h1 className='text-center font-bold text-xl'>LOGO</h1>
					<p className='text-sm text-center'>Login to see photos & videos from your friends </p>
				</div>
				<div>
					<span className="font-medium">Email</span>
					<Input
						type="text"
						name="email"
						value={input.email}
						onChange={changeEventHandler}
						className="focus-visible:ring-transparent my-2"
					/>
				</div>
				<div>
					<span className="font-medium block">Password</span>
					<Input
						type="text"
						name="password"
						value={input.password}
						onChange={changeEventHandler}
						className="focus-visible:ring-transparent my-2"
					/>
				</div>
				{
					loading ? (
						<Button>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Please wait
						</Button>
					) : (
						<Button type="submit">Login</Button>
					)
				}
				<span className='text-center'> Does not have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
			</form>
		</div>
	)
}

export default Login
