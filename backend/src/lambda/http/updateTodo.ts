import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'
import { handleError } from '../utils'

const logger = createLogger('Todo Update request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    const req = JSON.parse(event.body) as UpdateTodoRequest

    try {
      await updateTodo(todoId, req)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (e) {
      return handleError(e)
    }
  }
)

handler.use(cors())
