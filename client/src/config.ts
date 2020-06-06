// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'g44q10hyue'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-c01dnyms.eu.auth0.com', // Auth0 domain
  clientId: 'wKJRBfgFz1bdtEZ5WMeZUdM7jAnP5653', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
