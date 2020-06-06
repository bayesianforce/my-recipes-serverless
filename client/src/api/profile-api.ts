import Axios from 'axios'
import { apiEndpoint } from '../config'
import { MyProfile } from '../types/Profile'
import { UpdateProfileRequest } from '../types/UpdateProfileRequest'

export async function getProfile(idToken: string): Promise<MyProfile> {
  console.log('getProfile')

  const response = await Axios.get(`${apiEndpoint}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('getProfile:', response.data)
  return response.data.item
}

export async function createProfile(idToken: string): Promise<MyProfile> {
  console.log('createProfile')

  const response = await Axios.post(
    `${apiEndpoint}/profile`,
    JSON.stringify({}),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log('createProfile:', response.data)
  return response.data.item
}

export async function updateProfile(
  idToken: string,
  profile: UpdateProfileRequest
): Promise<void> {
  console.log('updateProfile')

  const response = await Axios.patch(
    `${apiEndpoint}/profile`,
    JSON.stringify(profile),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log('updateProfile:', response.data)
}

export async function getAvatarUrl(idToken: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/profile/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  await Axios.put(uploadUrl, file)
}
