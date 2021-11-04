import 'jest-fetch-mock'

import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import { AuthProvider, useAuth } from './auth'
import { startAsync } from 'expo-auth-session'
import fetchMock from 'jest-fetch-mock'

jest.mock('expo-auth-session')

fetchMock.enableMocks()

describe('Auth Hook', () => {
  it('should not connect if user cancel authentication', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel'
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toHaveProperty('id')
  })
  it('should be able to sign in with an existing Google account', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'any_token'
      }
    })

    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 'any_id',
        email: 'hey@email.com',
        name: 'Hey',
        photo: 'hey.png'
      })
    )

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user.email).toBe('hey@email.com')
  })
})
