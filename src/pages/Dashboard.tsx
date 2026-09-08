import { useMemo } from 'react'
import { Alert, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { useTasks } from '../hooks/useTasks'

function Dashboard() {
  const { tasks, loading, error } = useTasks()

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const pending = tasks.filter((task) => task.status === 'todo').length
    const highPriority = tasks.filter((task) => task.priority === 'high').length

    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      highPriority,
    }
  }, [tasks])

  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>Loading dashboard...</Typography>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">Failed to load dashboard summary.</Alert>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Total Tasks</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Completed</Typography>
              <Typography variant="h5">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">In Progress</Typography>
              <Typography variant="h5">{stats.inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Pending</Typography>
              <Typography variant="h5">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">High Priority</Typography>
              <Typography variant="h5">{stats.highPriority}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Dashboard
