import { User, Mail, Lock, AlertCircle, Loader } from 'lucide-react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import axios from "axios"
import { useState } from 'react'
import { useAuth } from '../context/Authcontext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, token, loading } = useAuth()

  if (!loading && token) {
    return <Navigate to='/chat' replace />
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = { username, email, password }
      const res = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/auth/register`,
        data,
        { withCredentials: true }
      )
      login(
        res.data.user.username,
        res.data.accessToken,
        res.data.user.id
      )
      navigate('/chat')
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message)
      setError(err.response?.data?.message || 'Registration failed. Please fill all fields correctly.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#0b141a] flex items-center justify-center p-4 antialiased text-white'>
      <div className='bg-[#111b21] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-800/50'>
        <h1 className='text-3xl text-white font-bold text-center tracking-tight'>Create Account</h1>
        <p className='text-gray-400 text-center mt-2 text-sm'>Join and start chatting in real-time</p>

        {error && (
          <div className='mt-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake'>
            <AlertCircle className='text-red-400 flex-shrink-0' size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className='mt-6 space-y-4'>
          <div className='relative'>
            <User className='absolute left-4 top-4 text-gray-400' size={18} />
            <input
              type='text'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder='Full Name'
              className='w-full bg-[#202c33] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none border border-transparent focus:border-[#00a884] placeholder-gray-500 text-sm transition-all duration-200'
              required
              disabled={isLoading}
            />
          </div>

          <div className='relative'>
            <Mail className='absolute left-4 top-4 text-gray-400' size={18} />
            <input
              type='email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Email Address'
              className='w-full bg-[#202c33] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none border border-transparent focus:border-[#00a884] placeholder-gray-500 text-sm transition-all duration-200'
              required
              disabled={isLoading}
            />
          </div>

          <div className='relative'>
            <Lock className='absolute left-4 top-4 text-gray-400' size={18} />
            <input
              type='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder='Password (min 6 characters)'
              className='w-full bg-[#202c33] text-white pl-12 pr-4 py-3.5 rounded-xl outline-none border border-transparent focus:border-[#00a884] placeholder-gray-500 text-sm transition-all duration-200'
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type='submit' 
            disabled={isLoading}
            className='w-full bg-[#00a884] hover:bg-[#008f72] active:scale-98 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer'
          >
            {isLoading ? (
              <>
                <Loader className='animate-spin' size={18} />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Signup</span>
            )}
          </button>
        </form>

        <p className='text-center text-gray-400 mt-6 text-sm'>
          Already have an account?
          <Link to='/' className='text-[#00a884] hover:underline font-semibold ml-2'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}