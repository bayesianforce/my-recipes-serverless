import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Card
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes } from '../api/recipe-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'

interface RecipeProps {
  auth: Auth
  history: History
}

interface RecipeState {
  recipe: Recipe[]
  newRecipeName: string
  loadingRecipe: boolean
}

export class Recipes extends React.PureComponent<RecipeProps, RecipeState> {
  state: RecipeState = {
    recipe: [],
    newRecipeName: '',
    loadingRecipe: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeName: event.target.value })
  }

  onEditButtonClick = (recipeId: string) => {
    this.props.history.push(`/recipes/${ recipeId }/edit`)
  }

  onRecipeCreate = async () => {
    try {
      const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
        name: this.state.newRecipeName
      })
      this.setState({
        recipe: [...this.state.recipe, newRecipe],
        newRecipeName: ''
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipe: this.state.recipe.filter(recipe => recipe.recipeId !== recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipe: recipes,
        loadingRecipe: false
      })
    } catch (e) {
      alert(`Failed to fetch recipes: ${ e.message }`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Recipes</Header>

        {this.renderCreateRecipeInput()}

        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Recipe',
              onClick: this.onRecipeCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the taste..."
            value={this.state.newRecipeName}
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipe) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Card.Group>
        {this.state.recipe.map((recipe) => {
          return (
            <Card fluid key={recipe.recipeId} >
              <Card.Content>
                <Image
                  style={{ height: 100, maxWidth: 100 }}
                  floated='left'
                  src={recipe.attachmentUrl || null}
                  size="small"
                  bordered
                />
                <Card.Header>
                  {recipe.name}
                </Card.Header>
                <Card.Meta
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {recipe.description}
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button
                    icon
                    basic
                    color="blue"
                    onClick={() => this.onEditButtonClick(recipe.recipeId)}
                  >
                    <Icon name="pencil" />
                    Edit your recipe
                  </Button>
                  <Button
                    icon
                    basic
                    color="red"
                    onClick={() => this.onRecipeDelete(recipe.recipeId)}
                  >
                    <Icon name="delete" />
                    Remove your recipe
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )
        })}
      </Card.Group>
    )
  }
}
