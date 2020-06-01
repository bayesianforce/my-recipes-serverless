import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { CustomError } from '../models/CustomError'

const logger = createLogger('Helper')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function handleError(error: CustomError): APIGatewayProxyResult {
  logger.info('handleError', error)

  if (error.statusCode && error.message) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ message: error.message })
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}
