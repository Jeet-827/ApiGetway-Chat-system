import { useState } from 'react'
import axios from 'axios'
import { Mail, Lock, MessageCircle, AlertCircle, Loader } from 'lucide-react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/Authcontext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, token, loading } = useAuth()

  if (!loading && token) {
    return <Navigate to='/chat' replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const data = { email, password }
      const res = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/auth/login`,
        data,
        { withCredentials: true }
      )
      console.log("Login success:", res.data)
      login(
        res.data.user.username,
        res.data.accessToken,
        res.data.user.id
      )
      navigate('/chat')
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message)
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#0b141a] flex items-center justify-center p-4 antialiased text-white'>
      <div className='bg-[#111b21] w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-800/50'>
        <div className='flex flex-col items-center'>
          <div className='bg-[#00a884] p-5 rounded-full shadow-lg shadow-emerald-500/10'>
            <MessageCircle className='text-white' size={48} />
          </div>

          <h1 className='text-3xl text-white font-bold mt-5 tracking-tight'>Welcome Back</h1>
          <p className='text-gray-400 mt-2 text-sm'>Login to continue chatting</p>
        </div>

        {error && (
          <div className='mt-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake'>
            <AlertCircle className='text-red-400 flex-shrink-0' size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className='mt-6 space-y-4'>
          <div className='relative'>
            <Mail className='absolute left-4 top-4 text-gray-400' size={18} />
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
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
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <p className='text-center text-gray-400 mt-6 text-sm'>
          Don't have an account?
          <Link to='/signup' className='text-[#00a884] hover:underline font-semibold ml-2'>
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}