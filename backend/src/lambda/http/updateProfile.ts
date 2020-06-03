import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { handleError, getUserId } from '../utils'
import { updateProfile } from '../../businessLogic/profile'
import { UpdateProfileRequest } from '../../requests/UpdateProfileRequest'

const logger = createLogger('Profile Update request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const userId = getUserId(event)
    const req = JSON.parse(event.body) as UpdateProfileRequest

    try {
      await updateProfile(userId, req)

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
