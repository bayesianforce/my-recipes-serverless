export interface Recipe {
  recipeId: string
  createdAt: string
  name: string
  description: string
  done: boolean
  attachmentUrl?: string
}
