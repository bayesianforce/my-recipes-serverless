import React, { useState, useEffect } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditRecipe } from './components/EditRecipe'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Recipes } from './components/Recipes'
import { Profile } from './components/Profile'
import { EditProfile } from './components/EditProfile'
import { getProfile } from './api/profile-api'
import { MyProfile } from './types/Profile'

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
  location: any
}

export function App({ auth, history, location }: AppProps) {
  const [profile, setProfile] = useState<MyProfile>()

  function handleLogin() {
    auth.login()
  }

  function handleLogout() {
    auth.logout()
  }

  async function getProfileByToken(token: string): Promise<void> {
    let profile = null

    try {
      if (auth.isAuthenticated()) {
        profile = await getProfile(token)
        setProfile(profile)
      }
    } catch  {
      history.push(`/profile/edit`)
    }
  }

  useEffect(() => {
    getProfileByToken(auth.getIdToken())
  }, [auth.isAuthenticated(), location?.state?.profile])

  return (
    <div>
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Router history={history}>
                {generateMenu()}

                {generateCurrentPage()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  )


  function generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  function logInLogOutButton() {
    if (auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  function generateCurrentPage() {
    if (!auth.isAuthenticated()) {
      return <LogIn auth={auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={
            props => {
              return (<>
                {profile
                  && (
                    <>
                      <Profile
                        {...props}
                        auth={auth}
                        profile={profile}
                      />
                      <Recipes
                        {...props}
                        auth={auth}
                      />
                    </>
                  )}
              </>
              )
            }
          }
        />

        <Route
          path="/profile/edit"
          exact
          render={props => {
            return (
              <EditProfile
                {...props}
                auth={auth}
                profile={profile}
              />
            )
          }}
        />

        <Route
          path="/recipes/:recipeId/edit"
          exact
          render={props => {
            return <EditRecipe
              {...props}
              auth={auth}
            />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
