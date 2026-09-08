import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'

interface HeaderProps {
  onOpenMobileMenu: () => void
}

function Header({ onOpenMobileMenu }: HeaderProps) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onOpenMobileMenu}
          sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}
          aria-label="open navigation menu"
        >
          Menu
        </IconButton>
        <Typography variant="h6" component="h1" noWrap>
          Task Manager
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
