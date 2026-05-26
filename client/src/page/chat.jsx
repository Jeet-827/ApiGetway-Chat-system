import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  LogOut,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../context/Authcontext.jsx'
import { io } from 'socket.io-client'
import axios from 'axios'

export default function Chat() {
  const { user, token, logout, userId } = useAuth()
  const [users, setUsers] = useState([])
  const [reciveId, setReciveId] = useState(() => localStorage.getItem('activeReciveId') || '')
  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('activeUser')
    return saved ? JSON.parse(saved) : null
  })
  const socketRef = useRef(null)
  const reciveIdRef = useRef(reciveId)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    reciveIdRef.current = reciveId
  }, [reciveId])

  // ─── Socket Setup ─────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return

    // Connect directly to the Socket.IO server hosted on the API Gateway (port 8000)
    const gatewayUrl = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8000'

    const socket = io(gatewayUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log(' Socket connected:', socket.id)
      setSocketConnected(true)
      socket.emit('register', userId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    socket.on('reconnect', () => {
      setSocketConnected(true)
      socket.emit('register', userId)
    })

    socket.emit('register', userId)

    socket.on('receive-message', (data) => {
      console.log('📩 Received message payload:', data)
      console.log('Comparing sender:', data?.senderId, 'with active recipient:', reciveIdRef.current)
      
      const incomingSender = String(data?.senderId || '').trim()
      const activeReceiver = String(reciveIdRef.current || '').trim()

      if (incomingSender && activeReceiver && incomingSender === activeReceiver) {
        console.log('✅ Matches active chat! Appending message to screen.')
        // ✅ Instantly update UI without reload
        setMessages((prev) => [
          ...prev,
          {
            text: data.message,
            mine: false,
          },
        ])
      } else {
        console.log('ℹ️ Message ignored: belongs to a different chat or active reciveId is not selected yet.')
      }
    })

    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setSocketConnected(false)
    }
  }, [userId])

  // ─── Fetch Users ──────────────────────────────────────────────
  const getUsers = useCallback(async () => {
    if (!token) return
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY}/api/getuser/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsers(res.data.users || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }, [token])

  useEffect(() => {
    if (token) getUsers()
  }, [token, getUsers])

  // ─── Fetch Chat History ───────────────────────────────────────
  const openChat = useCallback(
    async (uid) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY}/socket/chat/messages/${userId}/${uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const formatted = (res.data || []).map((msg) => ({
          text: msg.message,
          mine: msg.senderId === userId,
        }))
        setMessages(formatted)
      } catch (error) {
        console.error('openChat error:', error.response?.data || error.message)
        setMessages([])
      }
    },
    [userId, token]
  )

  // ─── Restore on Refresh ───────────────────────────────────────
  useEffect(() => {
    if (token && activeUser && reciveId) {
      joinRoom(reciveId)
      openChat(reciveId)
    }
  }, [token])

  // ─── Join Room ────────────────────────────────────────────────
  const joinRoom = (roomId) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId)
    }
  }

  // ─── User Click ───────────────────────────────────────────────
  const handleUserClick = (item, idx) => {
    const userData = { ...item, avatarIdx: idx }
    setReciveId(item._id)
    setActiveUser(userData)
    localStorage.setItem('activeReciveId', item._id)
    localStorage.setItem('activeUser', JSON.stringify(userData))
    joinRoom(item._id)
    setMessages([])
    openChat(item._id)
  }

  // ─── Send Message ─────────────────────────────────────────────
  const handleMessage = (e) => {
    if (e) e.preventDefault()
    if (!message.trim() || !reciveId || !socketRef.current) return

    // ✅ Instantly show sender's message in UI
    setMessages((prev) => [...prev, { text: message, mine: true }])

    // ✅ Emit to socket for real-time delivery to receiver
    socketRef.current.emit('message', {
      message,
      senderId: userId,
      reciveId,
    })

    // ✅ Save to DB
    axios
      .post(`${import.meta.env.VITE_API_GATEWAY}/socket/chat/send`, {
        senderId: userId,
        reciverId: reciveId,
        message,
      })
      .catch((err) => console.error('Failed to save message:', err.message))

    setMessage('')
  }

  // ─── UI ───────────────────────────────────────────────────────
  return (
    <div className='h-screen bg-[#0b141a] flex'>

      {/* Sidebar */}
      <div className='w-[30%] bg-[#111b21] border-r border-gray-700 hidden md:flex flex-col'>

        {/* Header */}
        <div className='p-4 flex items-center justify-between bg-[#202c33]'>
          <div className='flex items-center gap-3'>
            <img
              src='https://i.pravatar.cc/150?img=12'
              alt='profile'
              className='w-12 h-12 rounded-full'
            />
            <div>
              <h2 className='text-white font-semibold'>{user || 'User'}</h2>
              <p className={socketConnected ? 'text-green-400 text-xs mt-0.5' : 'text-red-400 text-xs mt-0.5 animate-pulse'}>
                {socketConnected ? '● Connected' : '○ Disconnected'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <LogOut
              onClick={logout}
              className='text-gray-400 hover:text-red-500 cursor-pointer transition-colors'
              size={20}
              title='Logout'
            />
            <MoreVertical className='text-white cursor-pointer' />
          </div>
        </div>

        {/* Search */}
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

        {/* Users */}
        <div className='space-y-1 px-2 overflow-y-auto flex-1'>
          {users.map((item, idx) => (
            <div
              onClick={() => handleUserClick(item, idx)}
              key={item._id || idx}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                reciveId === item._id ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
              }`}
            >
              <img
                src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                className='w-14 h-14 rounded-full'
                alt={item.username}
              />
              <div>
                <h3 className='text-white font-semibold'>{item.username}</h3>
                <p className='text-gray-400 text-sm'>Tap to chat</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className='flex-1 flex flex-col'>
        {activeUser ? (
          <>
            {/* Chat Header */}
            <div className='bg-[#202c33] p-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <img
                  src={`https://i.pravatar.cc/150?img=${activeUser.avatarIdx + 10}`}
                  className='w-12 h-12 rounded-full'
                  alt={activeUser.username}
                />
                <div>
                  <h2 className='text-white font-semibold'>{activeUser.username}</h2>
                  <p className='text-green-400 text-sm'>Online</p>
                </div>
              </div>
              <div className='flex gap-5 text-white'>
                <Video className='cursor-pointer hover:text-green-400 transition-colors' />
                <Phone className='cursor-pointer hover:text-green-400 transition-colors' />
                <MoreVertical className='cursor-pointer' />
              </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 p-6 overflow-y-auto bg-[#0b141a] space-y-4'>
              {messages.length === 0 && (
                <div className='flex justify-center mt-10'>
                  <p className='text-gray-500 text-sm bg-[#202c33] px-4 py-2 rounded-full'>
                    No messages yet. Say hello! 👋
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-xs break-words text-sm shadow ${
                      msg.mine
                        ? 'bg-[#25D366] text-black rounded-br-none'
                        : 'bg-[#202c33] text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='p-4 bg-[#202c33]'>
              <form onSubmit={handleMessage} className='flex items-center gap-4'>
                <input
                  type='text'
                  placeholder='Type a message'
                  className='flex-1 bg-[#111b21] text-white px-5 py-4 rounded-full outline-none'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type='submit'
                  className='cursor-pointer bg-[#25D366] p-4 rounded-full hover:bg-[#1ebe59] transition-colors'
                >
                  <Send className='text-black' />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center bg-[#0b141a] gap-4'>
            <div className='bg-[#202c33] p-6 rounded-full'>
              <MessageSquare className='text-gray-500' size={48} />
            </div>
            <h2 className='text-white text-2xl font-semibold'>WhatsApp Web</h2>
            <p className='text-gray-400 text-center max-w-sm'>
              Select a chat from the left to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  )
}