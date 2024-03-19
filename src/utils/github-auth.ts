import githubConfig from '@/config/github'

export class Github {
  constructor() {}

  getAuthUrl() {
    const searchParams = new URLSearchParams({
      client_id: githubConfig.githubClientID,
    })
    return `https://github.com/login/oauth/authorize?${searchParams.toString()}`
  }

  async getToken(code: string) {
    const searchParams = new URLSearchParams({
      client_id: githubConfig.githubClientID,
      client_secret: githubConfig.githubClientSecret,
      code: code,
    })
    const response = await fetch(`https://github.com/login/oauth/access_token?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  }

  setCredentials(tokens: any) {
    // this.oAuth2Client.setCredentials(tokens)
  }

  async userInfo() {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ya29.a0AfB_byAlpDQd6CHynRXdawpuUo1mLq2R1RioNdEInJMa7Ad-Wl8FmG2ANAsNZ1uBv5AfBRV-rlILzQSv9ZEwBbKfC1L6ti9c3n6yNfrSPhDcrphPKnVSbalChOPeThJmWf7x5sD9BbZpxUlAlzRmvzT7ME89UIzZ-WnbaCgYKAaYSARISFQHGX2MiB893Kiac4c087OmJjV8ZNg0171',
      },
    })
    return response.json()
  }
}
