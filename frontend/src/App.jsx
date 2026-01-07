import React from 'react'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import RegsiterPage from './pages/RegsiterPage'
import DashboardPage from './pages/DashboardPage'
import PublicRoute from './components/auth/PublicRoute'
import ProtectedRoute from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/login' element={<PublicRoute><LoginPage/></PublicRoute>}/>
      <Route path='/register' element={<PublicRoute><RegsiterPage/></PublicRoute>}/>
      <Route path='/dashboard' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
    </Routes>
  )
}
export default App
