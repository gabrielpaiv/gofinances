import React from 'react'
import { TextInputProps } from 'react-native'
import { Container } from './styles'

interface InputProps extends TextInputProps {}

export function Input({ ...rest }: InputProps) {
  return <Container {...rest} />
}
