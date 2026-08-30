import TaskModel from '../models/Task'
import { TaskInput } from '../types/task'

const validTask: TaskInput = {
  title: 'Finish backend setup',
  description: 'Prepare backend infrastructure for next stage',
  status: 'todo',
  priority: 'medium',
  category: 'project',
  dueDate: new Date('2026-12-31'),
}

const invalidTask = {
  title: '   ',
  description: '',
  status: 'done',
  priority: 'urgent',
  category: '',
  dueDate: 'invalid-date',
}

const runValidationCheck = async () => {
  const validDoc = new TaskModel(validTask)

  try {
    await validDoc.validate()
  } catch (error) {
    console.error('Valid task should pass validation but failed:', error)
    process.exit(1)
  }

  const invalidDoc = new TaskModel(invalidTask)

  let invalidFailedAsExpected = false

  try {
    await invalidDoc.validate()
  } catch (_error) {
    invalidFailedAsExpected = true
  }

  if (!invalidFailedAsExpected) {
    console.error('Invalid task should fail validation but passed.')
    process.exit(1)
  }

  console.log('Task model validation check passed.')
}

void runValidationCheck()
