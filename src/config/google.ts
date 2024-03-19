export const googleClientID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? ''
export const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? ''
export const googleClientRedirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL ?? ''

export default {
  googleClientID,
  googleClientSecret,
  googleClientRedirectUrl,
}
