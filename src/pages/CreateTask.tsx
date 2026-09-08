import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { createTask } from '../services/taskService'
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task'
import type { CreateTaskPayload, TaskPriority, TaskStatus } from '../types/task'

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

function CreateTask() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<CreateTaskPayload>(initialFormValues)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

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

      await createTask(payload)
      setSubmitSuccess('Task created successfully!')
      setFormValues(initialFormValues)
      setFormErrors({})
      setTimeout(() => {
        navigate('/tasks')
      }, 700)
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const backendMessage = axiosError.response?.data?.message
      setSubmitError(backendMessage ?? 'Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Create Task
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
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
              {isSubmitting ? 'Creating task...' : 'Create Task'}
            </Button>
            <Button type="button" variant="outlined" onClick={() => navigate('/tasks')} disabled={isSubmitting}>
              Back to Tasks
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default CreateTask
