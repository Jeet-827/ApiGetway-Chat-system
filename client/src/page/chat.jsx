import { useEffect } from 'react'
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
} from 'lucide-react'
import { io } from 'socket.io-client'

const socket = io("http://localhost:8000",{
     path: "/socket/socket.io",
})
export default function Chat() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Client connected! Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className='h-screen bg-[#0b141a] flex'>
      {/* Sidebar */}
      <div className='w-[30%] bg-[#111b21] border-r border-gray-700 hidden md:block'>
        <div className='p-4 flex items-center justify-between bg-[#202c33]'>
          <div className='flex items-center gap-3'>
            <img
              src='https://i.pravatar.cc/150?img=12'
              alt='profile'
              className='w-12 h-12 rounded-full'
            />
            <h2 className='text-white font-semibold'>My Chats</h2>
          </div>

          <MoreVertical className='text-white cursor-pointer' />
        </div>

        <div className='p-4'>
          <div className='bg-[#202c33] rounded-xl flex items-center px-4 py-3'>
            <Search className='text-gray-400' size={20} />
            <input
              type='text'
              placeholder='Search chat'
              className='bg-transparent outline-none text-white ml-3 w-full'
            />
          </div>
        </div>

        <div className='space-y-2 px-2'>
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className='flex items-center gap-4 p-3 hover:bg-[#202c33] rounded-xl cursor-pointer'
            >
              <img
                src={`https://i.pravatar.cc/150?img=${item + 10}`}
                className='w-14 h-14 rounded-full'
              />

              <div>
                <h3 className='text-white font-semibold'>User {item}</h3>
                <p className='text-gray-400 text-sm'>Typing...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className='flex-1 flex flex-col'>
        <div className='bg-[#202c33] p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img
              src='https://i.pravatar.cc/150?img=15'
              className='w-12 h-12 rounded-full'
            />

            <div>
              <h2 className='text-white font-semibold'>Rahul Sharma</h2>
              <p className='text-gray-300 text-sm'>Online</p>
            </div>
          </div>

          <div className='flex gap-5 text-white'>
            <Video className='cursor-pointer' />
            <Phone className='cursor-pointer' />
            <MoreVertical className='cursor-pointer' />
          </div>
        </div>

        <div className='flex-1 p-6 overflow-y-auto bg-[#0b141a] space-y-4'>
          <div className='flex justify-start'>
            <div className='bg-[#202c33] text-white px-5 py-3 rounded-2xl max-w-xs'>
              Hey 👋
            </div>
          </div>

          <div className='flex justify-end'>
            <div className='bg-[#25D366] text-black px-5 py-3 rounded-2xl max-w-xs'>
              Hello, how are you?
            </div>
          </div>

          <div className='flex justify-start'>
            <div className='bg-[#202c33] text-white px-5 py-3 rounded-2xl max-w-xs'>
              I'm fine 😄
            </div>
          </div>
        </div>

        <div className='p-4 bg-[#202c33] flex items-center gap-4'>
          <input
            type='text'
            placeholder='Type a message'
            className='flex-1 bg-[#111b21] text-white px-5 py-4 rounded-full outline-none'
          />

          <button className='bg-[#25D366] p-4 rounded-full'>
            <Send className='text-black' />
          </button>
        </div>
      </div>
    </div>
  )
}