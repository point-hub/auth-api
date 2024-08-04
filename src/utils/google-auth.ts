import { Credentials } from 'google-auth-library'
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

  setCredentials(credentials: Credentials) {
    this.oAuth2Client.setCredentials(credentials)
  }

  async userInfo(token: string) {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    return response.json()
  }
}
