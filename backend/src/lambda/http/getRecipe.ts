import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'
import { handleError } from '../utils'

const logger = createLogger('Recipe Get All request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const recipeId = event.pathParameters.recipeId

    try {
      const items = await getRecipe(recipeId)

      return {
        statusCode: 200,
        body: JSON.stringify({ items })
      }
    } catch (e) {
      return handleError(e)
    }
  }
)

handler.use(cors())
