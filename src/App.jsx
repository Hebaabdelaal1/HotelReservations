// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import RoomDetails from './features/rooms/RoomDetails'
import SignUp from './features/auth/SignUp'
import Login from './features/auth/Login'
import Reservations from './pages/Reservations'
import Footer from './components/Footer'


export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room/:id" element={<RoomDetails />} />
		<Route path="/reservations" element={<Reservations />} />
      </Routes>
	  <Footer />
    </div>
  )
}
