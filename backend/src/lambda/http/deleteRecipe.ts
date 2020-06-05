import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteRecipe } from '../../businessLogic/recipes'
import { handleError } from '../utils'

const logger = createLogger('Recipe Delete request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event)

    const recipeId = event.pathParameters.recipeId

    try {
      await deleteRecipe(recipeId)

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
