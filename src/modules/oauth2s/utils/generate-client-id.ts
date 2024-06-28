import crypto from 'crypto'

export const generateClientId = () => {
  return crypto.randomBytes(12).toString('hex')
}
