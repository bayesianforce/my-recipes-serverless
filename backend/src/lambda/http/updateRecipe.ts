import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { createLogger } from '../../utils/logger'
import { updateRecipe } from '../../businessLogic/recipes'
import { handleError } from '../utils'

const logger = createLogger('Recipe Update request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

    const recipeId = event.pathParameters.recipeId
    const req = JSON.parse(event.body) as UpdateRecipeRequest

    try {
      await updateRecipe(recipeId, req)

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
