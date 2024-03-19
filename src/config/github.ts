export const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID ?? ''
export const githubClientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET ?? ''
export const githubClientRedirectUrl = process.env.GITHUB_OAUTH_REDIRECT_URL ?? ''

export default {
  githubClientID,
  githubClientSecret,
  githubClientRedirectUrl,
}
