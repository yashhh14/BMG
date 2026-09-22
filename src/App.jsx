import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Bookings from './pages/Bookings/Bookings'
import Settings from './pages/Settings/Settings'
import Favourites from './pages/Favourites/Favourites'
import Support from './pages/Support/Support'
import Profile from './pages/Profile/Profile'
import AdminLogin from './pages/AdminLogin/AdminLogin'
import Trains from './pages/Trains/Trains'
import Flights from './pages/Flights/Flights'
import Busses from './pages/Busses/Busses'
import Cabs from './pages/Cabs/Cabs'
import Hotels from './pages/Hotels/Hotels'
import Login from './pages/LoginSignUp/Login'
import Signup from './pages/LoginSignUp/Signup'
import Layout from './Layout'
import './App.css'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/buses" element={<Busses />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/hotels" element={<Hotels />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App