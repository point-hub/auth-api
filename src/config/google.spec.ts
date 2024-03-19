import { describe, expect, it } from 'bun:test'

import googleConfig from './google'

describe('google config', () => {
  it('client id should be typeof string', () => {
    expect(typeof googleConfig.googleClientID).toBe('string')
  })
  it('client secret should be typeof string', () => {
    expect(typeof googleConfig.googleClientSecret).toBe('string')
  })
  it('client redirect url should be typeof string', () => {
    expect(typeof googleConfig.googleClientRedirectUrl).toBe('string')
  })
})
