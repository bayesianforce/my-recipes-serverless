import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/todos'
import { handleError } from '../utils'

const logger = createLogger('Todo Delete request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const todoId = event.pathParameters.todoId

    try {
      const uploadUrl = await generateUploadUrl(todoId)

      return {
        statusCode: 201,
        body: JSON.stringify({ uploadUrl })
      }
    } catch (e) {
      return handleError(e)
    }
  }
)

handler.use(cors())
