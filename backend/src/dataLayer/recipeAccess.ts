import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { RecipeItem } from '../models/RecipeItem'
import { createLogger } from '../utils/logger'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { RecipeUpdate } from '../models/RecipeUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Recipe Access')

export function recipeAccessCreator() {
  const docClient = new XAWS.DynamoDB.DocumentClient()
  const recipeTable = process.env.RECIPE_TABLE
  const userIdIndex = process.env.USER_ID_INDEX
  const bucketName = process.env.IMAGES_S3_BUCKET

  async function getRecipeById(recipeId: string): Promise<RecipeItem> {
    logger.info('getRecipeById', { recipeId })

    const params = {
      TableName: recipeTable,
      KeyConditionExpression: 'recipeId = :recipeId',
      ExpressionAttributeValues: { ':recipeId': recipeId }
    }

    const result = await docClient.query(params).promise()

    if (result.Items.length < 1) {
      throw {
        statusCode: '404',
        message: 'Item not found'
      }
    }

    return result.Items[0] as RecipeItem
  }

  async function getRecipes(userId: string): Promise<RecipeItem[]> {
    logger.info('getRecipes', userId)

    const params = {
      TableName: recipeTable,
      IndexName: userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await docClient.query(params).promise()

    return result.Items as RecipeItem[]
  }

  async function createRecipe(
    recipe: CreateRecipeRequest
  ): Promise<RecipeItem> {
    logger.info('createRecipe', recipe)

    const params = {
      TableName: recipeTable,
      Item: recipe
    }

    await docClient.put(params).promise()

    return recipe as RecipeItem
  }

  async function updateRecipe(
    recipeId: string,
    recipe: RecipeUpdate
  ): Promise<void> {
    logger.info('updateRecipe', `${recipeId} - ${recipe}`)

    const item = await getRecipeById(recipeId)

    const params = {
      TableName: recipeTable,
      Key: { recipeId: recipeId, createdAt: item.createdAt },
      UpdateExpression: 'set #N=:name, description=:description, done=:done',
      ExpressionAttributeNames: { '#N': 'name' },
      ExpressionAttributeValues: {
        ':name': recipe.name,
        ':description': recipe.description,
        ':done': recipe.done
      }
    }
    await docClient.update(params).promise()
  }

  async function deleteRecipe(recipeId: string) {
    logger.info('deleteRecipe', recipeId)

    const item = await getRecipeById(recipeId)

    const params = {
      TableName: recipeTable,
      Key: { recipeId: recipeId, createdAt: item.createdAt }
    }

    await docClient.delete(params).promise()
  }

  async function storeUploadUrl(
    imageId: string,
    recipeId: string
  ): Promise<void> {
    logger.info('storeUploadUrl', ` ${imageId} ${recipeId}`)

    const item = await getRecipeById(recipeId)

    const params1 = {
      TableName: recipeTable,
      Key: { recipeId: recipeId, createdAt: item.createdAt },
      UpdateExpression: 'set attachmentUrl=:attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${imageId}`
      }
    }

    await docClient.update(params1).promise()
  }

  return {
    getRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    storeUploadUrl
  }
}
