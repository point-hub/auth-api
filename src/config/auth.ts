export const issuer = process.env.JWT_ISSUER ?? ''
export const secret = process.env.JWT_SECRET ?? ''

export default {
  issuer,
  secret,
}
