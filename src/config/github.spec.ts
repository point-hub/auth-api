import { describe, expect, it } from 'bun:test'

import githubConfig from './github'

describe('github config', () => {
  it('client id should be typeof string', () => {
    expect(typeof githubConfig.githubClientID).toBe('string')
  })
  it('client secret should be typeof string', () => {
    expect(typeof githubConfig.githubClientSecret).toBe('string')
  })
  it('client redirect url should be typeof string', () => {
    expect(typeof githubConfig.githubClientRedirectUrl).toBe('string')
  })
})
