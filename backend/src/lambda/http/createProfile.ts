import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { handleError, getUserId } from '../utils'
import { createProfile } from '../../businessLogic/profile'

const logger = createLogger('Profile Update request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const userId = getUserId(event)

    try {
      const item = await createProfile(userId)

      return {
        statusCode: 201,
        body: JSON.stringify({ item })
      }
    } catch (e) {
      return handleError(e)
    }
  }
)

handler.use(cors())
