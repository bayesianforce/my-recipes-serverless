import * as uuid from 'uuid'
import { profileAccessCreator } from '../dataLayer/profileAccess'
import { ProfileUpdate } from '../models/ProfileUpdate'
import { ProfileItem } from '../models/ProfileItem'
import { storageAccessCreator } from '../dataLayer/storageAccess'

const ProfileAccess = profileAccessCreator()
const StorageAccess = storageAccessCreator()

export async function getProfile(userId: string): Promise<ProfileItem> {
  return ProfileAccess.getProfile(userId)
}

export async function createProfile(userId: string): Promise<ProfileItem> {
  const newItem = {
    userId,
    name: undefined,
    isComplete: false
  }
  return ProfileAccess.createProfile(newItem)
}

export async function updateProfile(
  userId: string,
  profile: ProfileUpdate
): Promise<void> {
  return ProfileAccess.updateProfile(userId, profile)
}

export async function generateUploadUrl(userId: string): Promise<string> {
  const imageId = uuid.v4()
  const url = await StorageAccess.getUploadUrl(imageId)

  ProfileAccess.storeUploadUrl(imageId, userId)

  return url
}
