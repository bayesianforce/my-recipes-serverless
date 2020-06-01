import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Storage Access')

export function storageAccessCreator() {
  const bucketName = process.env.IMAGES_S3_BUCKET
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  const s3 = new XAWS.S3({ signatureVersion: 'v4' })

  async function getUploadUrl(imageId: string): Promise<string> {
    logger.info('getUploadUrl', imageId)

    const params = {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    }

    return s3.getSignedUrl('putObject', params)
  }
  return {
    getUploadUrl
  }
}
