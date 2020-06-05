import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { ProfileItem } from '../models/ProfileItem'
import { ProfileUpdate } from '../models/ProfileUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Profile Access')

export function profileAccessCreator() {
  const docClient = new XAWS.DynamoDB.DocumentClient()
  const profileTable = process.env.PROFILE_TABLE
  const bucketName = process.env.IMAGES_S3_BUCKET

  async function getProfile(userId: string): Promise<ProfileItem> {
    logger.info('getProfile', { userId })

    const params = {
      TableName: profileTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }

    let result = await docClient.query(params).promise()

    if (result.Items.length < 1) {
      throw {
        statusCode: '404',
        message: 'Item not found'
      }
    }

    return result.Items[0] as ProfileItem
  }

  async function createProfile(profile: ProfileItem): Promise<ProfileItem> {
    logger.info('createProfile', profile)

    const params = {
      TableName: profileTable,
      Item: profile
    }

    await docClient.put(params).promise()

    return profile
  }

  async function updateProfile(
    userId: string,
    profile: ProfileUpdate
  ): Promise<void> {
    logger.info('updateProfile', `${userId} - ${profile}`)

    const params = {
      TableName: profileTable,
      Key: { userId },
      UpdateExpression: 'set #N=:name, isComplete=:isComplete',
      ExpressionAttributeNames: { '#N': 'name' },
      ExpressionAttributeValues: {
        ':name': profile.name,
        ':isComplete': profile.isComplete
      }
    }
    await docClient.update(params).promise()
  }

  async function storeUploadUrl(
    imageId: string,
    userId: string
  ): Promise<void> {
    logger.info('storeUploadUrl', ` ${imageId} ${userId}`)

    const params = {
      TableName: profileTable,
      Key: { userId },
      UpdateExpression: 'set attachmentUrl=:attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${imageId}`
      }
    }

    await docClient.update(params).promise()
  }

  return {
    getProfile,
    createProfile,
    updateProfile,
    storeUploadUrl
  }
}
