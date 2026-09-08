import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'

const drawerWidth = 220

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigationList = (
    <List>
      <ListItemButton component={NavLink} to="/" onClick={onMobileClose}>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton component={NavLink} to="/dashboard" onClick={onMobileClose}>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton component={NavLink} to="/tasks" onClick={onMobileClose}>
        <ListItemText primary="Tasks" />
      </ListItemButton>
      <ListItemButton component={NavLink} to="/tasks/new" onClick={onMobileClose}>
        <ListItemText primary="Create Task" />
      </ListItemButton>
    </List>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        {navigationList}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        {navigationList}
      </Drawer>
    </>
  )
}

export default Sidebar
