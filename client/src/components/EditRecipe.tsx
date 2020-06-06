import React, { useState, useEffect } from 'react'
import { Form, Message, Icon, Dimmer, Loader } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, patchRecipe, getRecipe } from '../api/recipe-api'
import { Upload } from './Upload'

interface EditRecipeProps {
  match: {
    params: {
      recipeId: string
    }
  }
  auth: Auth
  history: any
}


export function EditRecipe({ auth, history, match }: EditRecipeProps) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  function handleChangeDescription({ target: { value } }: React.ChangeEvent<any>) {
    setDescription(value)
  }

  async function getUrl(): Promise<string> {
    return getUploadUrl(auth.getIdToken(), match.params.recipeId)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = {
      name,
      description,
      done: true
    }

    try {
      setIsLoading(true)
      await patchRecipe(auth.getIdToken(), match.params.recipeId, params)
      setIsLoading(false)

      history.goBack('/')
    } catch {
      setIsLoading(false)
      alert('Operation Failed')
    }
  }
  async function getRecipeByRecipeId(token: string, recipeId: string): Promise<void> {
    let recipe = null

    try {
      recipe = await getRecipe(token, recipeId)

      setName(recipe.name)
      setDescription(recipe.description)
    } catch  {
      alert('recipe not found')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRecipeByRecipeId(auth.getIdToken(), match.params.recipeId)
  }, [auth.getIdToken()])
  return (
    <>
      <Message warning icon>
        <Icon size='huge' name='hand point right' />
        <Message.Content>
          <Message.Header>It's time to create a new Recipe!!</Message.Header>
              Store your last recipe
          </Message.Content>
      </Message>

      <Form onSubmit={handleSubmit}>
        <Form.TextArea
          value={description}
          placeholder="Add your recipe here..."
          onChange={handleChangeDescription}
        />
        <Form.Field
          disabled={!description}
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
