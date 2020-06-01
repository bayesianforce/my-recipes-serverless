import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Todo Access')

export function todoAccessCreator() {
  const docClient = new XAWS.DynamoDB.DocumentClient()
  const todoTable = process.env.TODO_TABLE
  const userIdIndex = process.env.USER_ID_INDEX
  const bucketName = process.env.IMAGES_S3_BUCKET

  async function getTodoById(todoId: string): Promise<TodoItem> {
    logger.info('getTodoById', { todoId })

    const params = {
      TableName: todoTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: { ':todoId': todoId }
    }

    const result = await docClient.query(params).promise()

    if (result.Items.length < 1) {
      throw {
        statusCode: '404',
        message: 'Item not found'
      }
    }

    return result.Items[0] as TodoItem
  }

  async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('getAllTodos', userId)

    const params = {
      TableName: todoTable,
      IndexName: userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await docClient.query(params).promise()

    return result.Items as TodoItem[]
  }

  async function createTodo(todo: CreateTodoRequest): Promise<TodoItem> {
    logger.info('createTodo', todo)

    const params = {
      TableName: todoTable,
      Item: todo
    }

    await docClient.put(params).promise()

    return todo as TodoItem
  }

  async function updateTodo(todoId: string, todo: TodoUpdate): Promise<void> {
    logger.info('updateTodo', `${todoId} - ${todo}`)

    const item = await getTodoById(todoId)

    const params = {
      TableName: todoTable,
      Key: { todoId, createdAt: item.createdAt },
      UpdateExpression: 'set #N=:name, dueDate=:dueDate, done=:done',
      ExpressionAttributeNames: { '#N': 'name' },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      }
    }
    await docClient.update(params).promise()
  }

  async function deleteTodo(todoId: string) {
    logger.info('deleteTodo', todoId)

    const item = await getTodoById(todoId)

    const params = {
      TableName: todoTable,
      Key: { todoId, createdAt: item.createdAt }
    }

    await docClient.delete(params).promise()
  }

  async function storeUploadUrl(
    imageId: string,
    todoId: string
  ): Promise<void> {
    logger.info('generateUploadUrl', ` ${imageId} ${todoId}`)

    const item = await getTodoById(todoId)

    const params1 = {
      TableName: todoTable,
      Key: { todoId, createdAt: item.createdAt },
      UpdateExpression: 'set attachmentUrl=:attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${imageId}`
      }
    }

    await docClient.update(params1).promise()
  }

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    storeUploadUrl
  }
}
