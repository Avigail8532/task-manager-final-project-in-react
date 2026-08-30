import { Schema, Types, model } from 'mongoose'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  Task,
  TaskInput,
} from '../types/task'

const taskSchema = new Schema<TaskInput>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Title cannot be empty',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      required: [true, 'Status is required'],
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      required: [true, 'Priority is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

taskSchema.set('toJSON', {
  transform: (_doc, ret: Partial<Task> & { _id?: Types.ObjectId }) => {
    if (ret._id) {
      ret.id = ret._id.toString()
      delete ret._id
    }
    return ret
  },
})

const TaskModel = model<TaskInput>('Task', taskSchema)

export default TaskModel
