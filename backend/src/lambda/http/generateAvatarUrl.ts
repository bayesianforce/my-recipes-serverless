import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { handleError, getUserId } from '../utils'
import { generateUploadUrl } from '../../businessLogic/profile'

const logger = createLogger('Recipe Delete request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const userId = getUserId(event)

    try {
      const uploadUrl = await generateUploadUrl(userId)

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
