import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const logger = createLogger('Todo Create request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event)

    const userId = getUserId(event)

    const parsedBody = JSON.parse(event.body) as CreateTodoRequest
    const item = await createTodo(parsedBody, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ item })
    }
  }
)

handler.use(cors())
