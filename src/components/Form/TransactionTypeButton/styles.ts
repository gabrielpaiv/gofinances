import styled, { css } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'

interface TransactionProps {
  type: 'up' | 'down'
  isActive?: boolean
}

export const Container = styled(TouchableOpacity)<TransactionProps>`
  width: 48%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: ${({ isActive }) => (isActive ? 0 : 1.5)}px solid
    ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  padding: 16px;
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
