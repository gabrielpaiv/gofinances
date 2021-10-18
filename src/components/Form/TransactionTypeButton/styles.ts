import styled, { css } from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import { RectButton } from 'react-native-gesture-handler'

interface TransactionProps {
  type: 'up' | 'down'
  isActive?: boolean
}

export const Container = styled.View<TransactionProps>`
  width: 48%;

  border: ${({ isActive }) => (isActive ? 0 : 1.5)}px solid
    ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  ${({ isActive, type }) =>
    isActive &&
    type === 'up' &&
    css`
      background-color: ${({ theme }) => theme.colors.success_light};
    `}
  ${({ isActive, type }) =>
    isActive &&
    type === 'down' &&
    css`
      background-color: ${({ theme }) => theme.colors.attention_light};
    `}
`

export const Button = styled(RectButton)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const Icon = styled(Feather)<TransactionProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;
  color: ${({ theme, type }) =>
    type === 'up' ? theme.colors.success : theme.colors.attention};
`

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`
