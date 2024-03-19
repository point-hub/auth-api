import { google } from 'googleapis'

import googleConfig from '@/config/google'

export class GoogleAuth {
  public oAuth2Client

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      googleConfig.googleClientID,
      googleConfig.googleClientSecret,
      googleConfig.googleClientRedirectUrl,
    )
  }

  getAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    })
  }

  async getToken(code: string) {
    return await this.oAuth2Client.getToken(code)
  }

  setCredentials(tokens: any) {
    this.oAuth2Client.setCredentials(tokens)
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
