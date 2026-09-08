import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Task Manager
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage tasks with create, update, delete, and details pages.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/tasks/new" variant="contained">
          Create Task
        </Button>
        <Button component={Link} to="/tasks" variant="outlined">
          View Tasks
        </Button>
      </Stack>
    </Box>
  )
}

export default Home
