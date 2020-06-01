import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'
import { handleError } from '../utils'

const logger = createLogger('Todo Delete request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event)

    const todoId = event.pathParameters.todoId

    try {
      await deleteTodo(todoId)

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
