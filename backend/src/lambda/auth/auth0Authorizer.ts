import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'
import { createLogger } from '../../utils/logger'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJTu4bXgOnYNDSMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1jMDFkbnltcy5ldS5hdXRoMC5jb20wHhcNMjAwNTMwMjI0MTM0WhcN
MzQwMjA2MjI0MTM0WjAkMSIwIAYDVQQDExlkZXYtYzAxZG55bXMuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9B68vPOfwVoxlxbU
MMiNih8rQ0rROUkYeTkDFnMPN/z0BXVMwoHpZ95waOzAUrhgvyk8IH+JAejLgZIN
hj57XDWYe0yNWarDoDDZdkD7Ie+u+jaBTMFQJemRYvqpwXh+/lGDjWJYsLb5v3hH
lhyhGmi+kOB0vhA7MmrGzBEo+HL8dOMcmYClGviR4tnCHNc8eL8S2yOsK0Wmj0Ae
IK6+wTXxJIwawsT/H3pGefbGVUb4a2bIEzELRVBUw6k6p7DFp0qW6WzbxESJGKvq
OoodpDWiIfc+XKx1S5vDn0ZrEDuuykQkdIZAUo6SFU3fAe6VJac/YdvdS8WqcQp9
CAidtwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBR8KFigo7eo
vx5v1+67J1QG5jGOqTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ACkb1gZDyi2EX8yEjjLFiWEBzkeKj2W2xxP3NI87xV/geTm2QxMhccoJkoVQ61Z0
VB8ysTyGRF/6uQ9Ir4Go3TKUJ6M3vVgANSChHTGwej6vQ6TWyzyXEOvVWzxbrZMw
aSw/QTFYz4a0dm7eKKj+tlBICJ7uiScAYZ0B/K3chMw6VbPmWvLWrAZiUIxMaVyC
cVmv54LQ4ZijOlcgklJ3OLY/G6C2dO7i9FnU2LzEMHWxdquPI4knMzCvkZSZEyY7
c2c0/dwDyQCezrvV6TmXwj60y7/vd6FvTLgHef/HorrklxrceGTHV80ywQrR+gKz
R2RPXvFZqiqPVE67l3pZM4s=
-----END CERTIFICATE-----`

const logger = createLogger('auth')

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.info('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
