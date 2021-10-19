import React, { createContext, ReactNode, useContext } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

type User = {
  id: string
  name: string
  email: string
  photo?: string
}

interface AuthContextData {
  user: User
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: '1',
    name: 'Gabriel',
    email: 'Gabriel@email.com'
  }
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
}

export { AuthProvider, useAuth }
