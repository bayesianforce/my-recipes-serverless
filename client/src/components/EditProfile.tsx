import React, { useState, useEffect } from 'react'
import {
  Message,
  Icon,
  Form,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import { Upload } from './Upload'
import { updateProfile, getAvatarUrl } from '../api/profile-api'
import Auth from '../auth/Auth'
import { MyProfile } from '../types/Profile'

interface EditProfileProps {
  auth: Auth,
  history: any
  profile?: MyProfile

}

export function EditProfile({ auth, history, profile }: EditProfileProps) {
  const [name, setName] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()

  function handleChangeName({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setName(value)
  }

  async function getUrl(): Promise<string> {
    return getAvatarUrl(auth.getIdToken())
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = {
      name,
      isComplete: true
    }

    try {
      setIsLoading(true)
      await updateProfile(auth.getIdToken(), params)
      setIsLoading(false)

      history.push('/', { profile: { ...profile, name } })
    } catch {
      setIsLoading(false)
      alert('Operation Failed')
    }
  }

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    }
  }, [])

  return (
    <>
      <Message warning icon>
        <Icon size='huge' name='hand point right' />
        <Message.Content>
          <Message.Header>Hey, I want to know you better!</Message.Header>
          Please insert your name and optionally an image
        </Message.Content>
      </Message>

      <Form onSubmit={handleSubmit}>
        <Form.Input
          label='Username *'
          placeholder={"Add your username..."}
          value={name || ''}
          onChange={handleChangeName}
        />
        <Form.Field
          disabled={!name}
        >
          <label>Upload Image (optional) </label>
          <Upload
            auth={auth}
            getUrl={getUrl}
          />
        </Form.Field>
        <Form.Button
          primary
          icon
          labelPosition='left'
        >
          <Icon name='save' />
            Save
        </Form.Button>
      </Form>
      {
        isLoading
        &&
        <Dimmer active inverted>
          <Loader size='small'>Loading</Loader>
        </Dimmer>
      }
    </>
  )
}
