import { Mail, Lock, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/chat')
  }

  return (
    <div className='min-h-screen bg-[#0b141a] flex items-center justify-center p-4'>
      <div className='bg-[#111b21] w-full max-w-md rounded-3xl p-8 shadow-2xl'>
        <div className='flex flex-col items-center'>
          <div className='bg-[#25D366] p-5 rounded-full'>
            <MessageCircle className='text-white' size={50} />
          </div>

          <h1 className='text-3xl text-white font-bold mt-5'>Welcome Back</h1>
          <p className='text-gray-400 mt-2'>Login to continue chatting</p>
        </div>

        <form onSubmit={handleLogin} className='mt-8 space-y-5'>
          <div className='relative'>
            <Mail className='absolute left-4 top-4 text-gray-400' />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full bg-[#202c33] text-white pl-12 py-4 rounded-xl outline-none border border-transparent focus:border-[#25D366]'
            />
          </div>

          <div className='relative'>
            <Lock className='absolute left-4 top-4 text-gray-400' />
            <input
              type='password'
              placeholder='Password'
              className='w-full bg-[#202c33] text-white pl-12 py-4 rounded-xl outline-none border border-transparent focus:border-[#25D366]'
            />
          </div>

          <button className='w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-4 rounded-xl transition'>
            Login
          </button>
        </form>

        <p className='text-center text-gray-400 mt-6'>
          Don't have an account?
          <Link to='/signup' className='text-[#25D366] ml-2'>
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}