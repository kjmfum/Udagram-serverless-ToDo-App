import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-4wg778h3zio6lges.us.auth0.com/.well-known/jwks.json'



const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJLd2kdO/bwi8YMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi00d2c3NzhoM3ppbzZsZ2VzLnVzLmF1dGgwLmNvbTAeFw0yMzAxMTYx
NTUyMThaFw0zNjA5MjQxNTUyMThaMCwxKjAoBgNVBAMTIWRldi00d2c3NzhoM3pp
bzZsZ2VzLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAOQ3C9x9MLMqqpTFbsNDQTKfevXnrjz9xXE5l5Vj7QvMe105cHzc6npaKMiH
sw9U/GYEcfNpzTQA72qlEsE5656VOPQyfwSOWqyEAVvVSveSA+rcxzZ94GOjvGUo
NEDlpYUBXCUygL6kG6/Jb2uFtICUDl/JrPYBM6sKMH2RZBNKY7foCU7ceXJafHWA
a/AjQ3Me3WTejQCqubAxcu3H1qeRUyltzSpso6hsGUaLM83Hn+RoBAbM6QXmJeMX
eqpVDoIy99ohJz8+kJS+w5Bcj1xoWhonvsFwqxYafyidP9uxO7YvOpEeSCGM9ucN
5ey70mTFnZtfyi0tw0fkHfreUtsCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUECl4Y6rafiLUn6XlGFVvJvimOuwwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAsHWUC50aqkYGnJ0dBqdMBRpMLm32HEFXNUgJ/IY0P
S/JscRyDQMPmCaA57QVbVWjxlGMSPt/kFR2qY/qsNctDIy1oxndL6++qcGx8kaSJ
sroZLq8IzKJTT8YVCYY2UiOGCEStkpEJ6jOvdY9U4wpUvQPgdKEoOYqu2nroS4sm
kXLfHD70y2GhzTgnOy+Yw8aGwTe8ikSyZu77H1rIMUZOSqWya5yIE6l4MqV/vDGt
cCdSbgu6jsVABxwUY1jfS3eQrkGdyzt4crElINPvVJn2V5x0zRF/B4oouexyS9Kk
omrauu5gXrNCbaJTexQth2gT7Jq+SQ4GXsTjt3a3W75x
-----END CERTIFICATE-----
`


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  // const cert  = await Axios.get(`${jwksUrl}`)

//  Axios.get(`/${jwksUrl}`).then((cert1)=>{
//   console.log(`User cert ${cert1.status}`);
//   console.log(`User cert1 ${cert1.data[0]}`);
//   console.log(`User cert2 ${cert1.headers}`);
//   console.log(`User cert3 ${cert1.data.items}`);
//   console.log(`User cert4 ${cert1.data.items[0]}`);
// })
 
  try {
    console.log(`User event ${event.headers}`);
    console.log(`User token ${event.authorizationToken}`);
    const jwtToken = verifyToken(event.authorizationToken)
    console.log(`User not authorized 5 ${jwtToken}`);
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
    console.log(`User not authorized 3 ${e}`);
    
    logger.error('User not authorized', { error: e.message })

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
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  if (jwt.header.alg !== 'RS256') {
    // we are only supporting RS256 so fail if this happens.
    throw new Error('Not RS256')
  }
  
  console.log(`User not authorized 1`);
  logger.error('User getting near not authorized')
  // return verify(token, jwksUrl, {algorithms: ['RS256']}) as JwtPayload
  return verify(token, cert, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  logger.info('Authorizing header', authHeader)
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer'))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
