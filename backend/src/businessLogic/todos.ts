import * as uuid from 'uuid'
import { todoAccessCreator } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { parseUserId } from '../auth/utils'
import { storageAccessCreator } from '../dataLayer/storageAccess'

const TodoAccess = todoAccessCreator()
const StorageAccess = storageAccessCreator()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)

  return TodoAccess.getTodos(userId)
}

export async function createTodo(
  todo: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const createdAt = new Date().toISOString()
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    ...todo
  }

  return TodoAccess.createTodo(newItem)
}

export async function updateTodo(
  todoId: string,
  todo: TodoUpdate
): Promise<void> {
  return TodoAccess.updateTodo(todoId, todo)
}

export async function deleteTodo(todoId: string): Promise<void> {
  return TodoAccess.deleteTodo(todoId)
}

export async function generateUploadUrl(todoId: string): Promise<string> {
  const imageId = uuid.v4()
  const url = await StorageAccess.getUploadUrl(imageId)

  TodoAccess.storeUploadUrl(imageId, todoId)

  return url
}
