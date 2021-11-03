import 'jest-fetch-mock'

import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import { AuthProvider, useAuth } from './auth'
import { startAsync } from 'expo-auth-session'
import fetchMock from 'jest-fetch-mock'

jest.mock('expo-auth-session')

fetchMock.enableMocks()

describe('Auth Hook', () => {
  it('should be able to sign in with an existing Google account', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'success',
      user: {
        id: 'any_id',
        email: 'hey@email.com',
        name: 'Hey',
        photo: 'hey.png'
      }
    })

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    act(async () => await result.current.signInWithGoogle())
    await waitForNextUpdate()

    expect(result.current.user.email).toBe('hey@email.com')
  })
  it('should not connect if user cancel authentication', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel'
    })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toHaveProperty('id')
  })
})
