import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './page/Login'
import Signup from './page/Signup'
import Chat from './page/chat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )}