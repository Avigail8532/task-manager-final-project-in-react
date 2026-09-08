import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'

const drawerWidth = 220

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton component={NavLink} to="/">
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/tasks">
          <ListItemText primary="Tasks" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/tasks/new">
          <ListItemText primary="Create Task" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

export default Sidebar
