import * as uuid from 'uuid'
import { recipeAccessCreator } from '../dataLayer/recipeAccess'
import { RecipeItem } from '../models/RecipeItem'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { RecipeUpdate } from '../models/RecipeUpdate'
import { parseUserId } from '../auth/utils'
import { storageAccessCreator } from '../dataLayer/storageAccess'

const RecipeAccess = recipeAccessCreator()
const StorageAccess = storageAccessCreator()

export async function getRecipes(jwtToken: string): Promise<RecipeItem[]> {
  const userId = parseUserId(jwtToken)

  return RecipeAccess.getRecipes(userId)
}

export async function createRecipe(
  recipe: CreateRecipeRequest,
  userId: string
): Promise<RecipeItem> {
  const recipeId = uuid.v4()
  const createdAt = new Date().toISOString()

  const newItem = {
    userId,
    recipeId,
    createdAt,
    done: false,
    ...recipe
  }

  return RecipeAccess.createRecipe(newItem)
}

export async function updateRecipe(
  recipeId: string,
  recipe: RecipeUpdate
): Promise<void> {
  return RecipeAccess.updateRecipe(recipeId, recipe)
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  return RecipeAccess.deleteRecipe(recipeId)
}

export async function generateUploadUrl(recipeId: string): Promise<string> {
  const imageId = uuid.v4()
  const url = await StorageAccess.getUploadUrl(imageId)

  RecipeAccess.storeUploadUrl(imageId, recipeId)

  return url
}
