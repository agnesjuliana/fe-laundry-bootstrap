import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import Kasir from '../pages/Kasir'
import MemberPage from '../pages/MemberPage'
import PaketPage from '../pages/PaketPage'
import TransaksiPage from '../pages/TransaksiPage'
import UserPage from '../pages/UserPage'

export default function MainRoute() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage/>}/>
      <Route path="/member" element={<MemberPage />} />
      <Route path="/paket" element={<PaketPage />} />
      <Route path="/transaksi" element={<TransaksiPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/kasir" element={<Kasir />} />
    </Routes>
  )
}
