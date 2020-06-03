import { profileAccessCreator } from '../dataLayer/ProfileAccess'
import { ProfileUpdate } from '../models/ProfileUpdate'
import { ProfileItem } from '../models/ProfileItem'

const ProfileAccess = profileAccessCreator()

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
