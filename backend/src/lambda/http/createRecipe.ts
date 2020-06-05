import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'
import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'
import { getUserId } from '../utils'

const logger = createLogger('Recipe Create request')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', event)

    const userId = getUserId(event)

    const parsedBody = JSON.parse(event.body) as CreateRecipeRequest
    const item = await createRecipe(parsedBody, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ item })
    }
  }
)

handler.use(cors())
