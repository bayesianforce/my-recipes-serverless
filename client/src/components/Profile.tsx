import React, { useEffect, useState } from 'react'
import Auth from '../auth/Auth'
import {
  getProfile,
} from '../api/profile-api'
import {
  Button,
  Icon,
  Image,
  Card
} from 'semantic-ui-react'
import { MyProfile } from '../types/Profile'

interface ProfileProps {
  auth: Auth
  history: any
  profile: MyProfile
}

export function Profile({ history, profile }: ProfileProps) {
  function handleEditProfile() {
    history.push(`/profile/edit`)
  }

  function Profile({ name, attachmentUrl }: any) {
    return (
      <Card fluid>
        <Card.Content>
          <Button
            floated="right"
            size="small"
            icon
            color="blue"
            onClick={handleEditProfile}
          >
            <Icon name="pencil" />
          </Button>
          <Image src={attachmentUrl || null} size="mini" floated="left" />
          <Card.Header>How it's going {name} ?</Card.Header>
        </Card.Content>
      </Card>
    )
  }

  return (
    <>
      {profile
        &&
        <Profile
          name={profile.name}
          attachmentUrl={profile.attachmentUrl}
        />
      }
    </>
  )
}
