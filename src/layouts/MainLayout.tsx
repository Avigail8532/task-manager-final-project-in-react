import { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleOpenMobileMenu = () => {
    setMobileOpen(true)
  }

  const handleCloseMobileMenu = () => {
    setMobileOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onOpenMobileMenu={handleOpenMobileMenu} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleCloseMobileMenu} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
