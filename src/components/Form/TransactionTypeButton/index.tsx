import React from 'react'
import { RectButtonProps } from 'react-native-gesture-handler'
import { Container, Icon, Title, Button } from './styles'

interface TransactionTypeButtonProps extends RectButtonProps {
  type: 'up' | 'down'
  title: string
  isActive: boolean
}
const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
}

export function TransactionTypeButton({
  title,
  type,
  isActive,
  ...rest
}: TransactionTypeButtonProps) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  )
}
