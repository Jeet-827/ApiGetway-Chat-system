import { User, Mail, Lock, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()
    navigate('/chat')
  }

  return (
    <div className='min-h-screen bg-[#0b141a] flex items-center justify-center p-4'>
      <div className='bg-[#111b21] w-full max-w-md rounded-3xl p-8 shadow-2xl'>
        <h1 className='text-3xl text-white font-bold text-center'>Create Account</h1>
        <p className='text-gray-400 text-center mt-2'>Join and start chatting</p>

        <form onSubmit={handleSignup} className='mt-8 space-y-5'>
          <div className='relative'>
            <User className='absolute left-4 top-4 text-gray-400' />
            <input
              type='text'
              placeholder='Full Name'
              className='w-full bg-[#202c33] text-white pl-12 py-4 rounded-xl outline-none border border-transparent focus:border-[#25D366]'
            />
          </div>

          <div className='relative'>
            <Phone className='absolute left-4 top-4 text-gray-400' />
            <input
              type='text'
              placeholder='Phone Number'
              className='w-full bg-[#202c33] text-white pl-12 py-4 rounded-xl outline-none border border-transparent focus:border-[#25D366]'
            />
          </div>

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
            Signup
          </button>
        </form>

        <p className='text-center text-gray-400 mt-6'>
          Already have an account?
          <Link to='/' className='text-[#25D366] ml-2'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}