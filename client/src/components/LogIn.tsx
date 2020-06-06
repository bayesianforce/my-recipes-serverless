import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

export function LogIn({ auth }: LogInProps) {
  function onLogin() {
    auth.login()
  }

  return (
    <div>
      <h1>Please log in</h1>

      <Button onClick={onLogin} size="huge" color="olive">
        Log in
        </Button>
    </div>
  )
}

