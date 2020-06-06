import React, { useState } from 'react'
import { Input, Loader, Dimmer } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  uploadFile
} from '../api/profile-api'

enum UploadState {
  Success,
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface UploadProps {
  auth: Auth
  getUrl: () => Promise<string>
}

export function Upload({ getUrl }: UploadProps) {
  const [uploadState, setUploadState] = useState<number>(UploadState.NoUpload)

  function handleChangeFile(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault(

    )
    const files = event.target.files

    if (!files) {
      return
    }

    handleSubmit(files[0])
  }

  async function handleSubmit(file: File) {
    try {
      setUploadState(UploadState.FetchingPresignedUrl)

      const url = await getUrl()

      setUploadState(UploadState.UploadingFile)

      await uploadFile(url, file)
    } catch (e) {
      alert('Could not upload the file: ' + e.message)
    } finally {
      setUploadState(UploadState.Success)
    }
  }

  function setUploadProgress() {
    if (uploadState === UploadState.NoUpload) {
      return 'No Upload'
    }

    if (uploadState === UploadState.FetchingPresignedUrl) {
      return 'Uploading image metadata'
    }

    if (uploadState === UploadState.UploadingFile) {
      return 'Uploading file'
    }

    if (uploadState === UploadState.Success) {
      return 'File Uploaded'
    }
  }
  const status = setUploadProgress()

  return (
    <>
      <Input
        label={status}
        type="file"
        accept="image/*"
        placeholder="Image to upload"
        onChange={handleChangeFile}
      />
      {(uploadState === UploadState.UploadingFile || uploadState === UploadState.FetchingPresignedUrl)
        &&
        < Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      }
    </>
  )
}
