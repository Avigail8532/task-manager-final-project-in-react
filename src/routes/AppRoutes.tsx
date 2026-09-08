import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import TasksLayout from '../layouts/TasksLayout'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Tasks from '../pages/Tasks'
import TaskDetails from '../pages/TaskDetails'
import CreateTask from '../pages/CreateTask'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksLayout />}>
          <Route index element={<Tasks />} />
          <Route path="new" element={<CreateTask />} />
          <Route path=":id" element={<TaskDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
