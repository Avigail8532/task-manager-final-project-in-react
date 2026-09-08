import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { createTask, deleteTask, getTasks, updateTask } from '../services/taskService'
import type { CreateTaskPayload, Task, TaskPriority, TaskStatus } from '../types/task'
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task'

interface FormErrors {
  title?: string
  description?: string
  status?: string
  priority?: string
  category?: string
  dueDate?: string
}

const initialFormValues: CreateTaskPayload = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: '',
  dueDate: '',
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<CreateTaskPayload>(initialFormValues)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [deleteTargetTask, setDeleteTargetTask] = useState<Task | null>(null)
  const [isDeletingTaskId, setIsDeletingTaskId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(data)
      } catch (_err) {
        setError('Failed to load tasks. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void fetchTasks()
  }, [])

  const validateForm = (values: CreateTaskPayload): FormErrors => {
    const errors: FormErrors = {}

    if (!values.title.trim()) {
      errors.title = 'Title is required.'
    }

    if (!values.description.trim()) {
      errors.description = 'Description is required.'
    }

    if (!TASK_STATUSES.includes(values.status)) {
      errors.status = 'Please select a valid status.'
    }

    if (!TASK_PRIORITIES.includes(values.priority)) {
      errors.priority = 'Please select a valid priority.'
    }

    if (!values.category.trim()) {
      errors.category = 'Category is required.'
    }

    if (!values.dueDate) {
      errors.dueDate = 'Due date is required.'
    } else if (Number.isNaN(new Date(values.dueDate).getTime())) {
      errors.dueDate = 'Please enter a valid due date.'
    }

    return errors
  }

  const handleChange =
    (field: keyof CreateTaskPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormValues((prev) => ({ ...prev, [field]: value as CreateTaskPayload[typeof field] }))
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
      setSubmitError(null)
      setSubmitSuccess(null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateForm(formValues)
    setFormErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const payload: CreateTaskPayload = {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        status: formValues.status as TaskStatus,
        priority: formValues.priority as TaskPriority,
        category: formValues.category.trim(),
        dueDate: formValues.dueDate,
      }

      if (editingTaskId) {
        const updatedTask = await updateTask(editingTaskId, payload)
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
        setSubmitSuccess('Task updated successfully.')
        setEditingTaskId(null)
      } else {
        const createdTask = await createTask(payload)
        setTasks((prev) => [createdTask, ...prev])
        setSubmitSuccess('Task created successfully.')
      }

      setFormValues(initialFormValues)
      setFormErrors({})
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const backendMessage = axiosError.response?.data?.message
      setSubmitError(
        backendMessage ??
          (editingTaskId
            ? 'Failed to update task. Please try again.'
            : 'Failed to create task. Please try again.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id)
    setFormValues({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: new Date(task.dueDate).toISOString().slice(0, 10),
    })
    setFormErrors({})
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setFormValues(initialFormValues)
    setFormErrors({})
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetTask) {
      return
    }

    setIsDeletingTaskId(deleteTargetTask.id)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      await deleteTask(deleteTargetTask.id)
      setTasks((prev) => prev.filter((task) => task.id !== deleteTargetTask.id))
      if (editingTaskId === deleteTargetTask.id) {
        handleCancelEdit()
      }
      setDeleteTargetTask(null)
      setSubmitSuccess('Task deleted successfully.')
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const backendMessage = axiosError.response?.data?.message
      setSubmitError(backendMessage ?? 'Failed to delete task. Please try again.')
    } finally {
      setIsDeletingTaskId(null)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Tasks
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {editingTaskId ? 'Edit mode' : 'Create mode'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
      >
        <Stack spacing={2}>
          <TextField
            label="Title"
            required
            value={formValues.title}
            onChange={handleChange('title')}
            error={Boolean(formErrors.title)}
            helperText={formErrors.title}
          />
          <TextField
            label="Description"
            required
            multiline
            minRows={3}
            value={formValues.description}
            onChange={handleChange('description')}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Status"
              required
              value={formValues.status}
              onChange={handleChange('status')}
              error={Boolean(formErrors.status)}
              helperText={formErrors.status}
              fullWidth
            >
              {TASK_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              required
              value={formValues.priority}
              onChange={handleChange('priority')}
              error={Boolean(formErrors.priority)}
              helperText={formErrors.priority}
              fullWidth
            >
              {TASK_PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Category"
              required
              value={formValues.category}
              onChange={handleChange('category')}
              error={Boolean(formErrors.category)}
              helperText={formErrors.category}
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              required
              value={formValues.dueDate}
              onChange={handleChange('dueDate')}
              error={Boolean(formErrors.dueDate)}
              helperText={formErrors.dueDate}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting
                ? editingTaskId
                  ? 'Saving changes...'
                  : 'Creating task...'
                : editingTaskId
                  ? 'Save Changes'
                  : 'Create Task'}
            </Button>
            {editingTaskId && (
              <Button type="button" variant="outlined" onClick={handleCancelEdit} disabled={isSubmitting}>
                Cancel Edit
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {loading && (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <CircularProgress size={24} />
          <Typography>Loading tasks...</Typography>
        </Stack>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && tasks.length === 0 && <Typography>No tasks yet.</Typography>}

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Card key={task.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1, flexWrap: 'wrap' }}>
                <Chip label={`Status: ${task.status}`} size="small" />
                <Chip label={`Priority: ${task.priority}`} size="small" />
                <Chip label={`Category: ${task.category}`} size="small" />
              </Stack>
              <Typography variant="body2">
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditTask(task)}
                  disabled={isSubmitting || isDeletingTaskId === task.id}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => setDeleteTargetTask(task)}
                  disabled={isDeletingTaskId === task.id || isSubmitting}
                >
                  {isDeletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={Boolean(deleteTargetTask)} onClose={() => setDeleteTargetTask(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTargetTask(null)} disabled={Boolean(isDeletingTaskId)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => void handleConfirmDelete()}
            disabled={Boolean(isDeletingTaskId)}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Tasks
