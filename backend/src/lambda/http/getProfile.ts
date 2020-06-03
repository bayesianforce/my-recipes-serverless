import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getProfile } from '../../businessLogic/profile'
import { createLogger } from '../../utils/logger'
import { handleError, getUserId } from '../utils'

const logger = createLogger('Profile Get All request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const userId = getUserId(event)

    try {
      const item = await getProfile(userId)

      return {
        statusCode: 200,
        body: JSON.stringify({ item })
      }
    } catch (e) {
      return handleError(e)
    }
  }
)

handler.use(cors())
