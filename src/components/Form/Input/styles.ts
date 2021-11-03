import styled, { css } from 'styled-components/native'
import { TextInput } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

interface ContainerProps {
  active?: boolean
}

export const Container = styled(TextInput)<ContainerProps>`
  width: 100%;
  padding: 16px 18px;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  margin-bottom: 8px;

  ${({ theme, active }) =>
    active &&
    css`
      border-width: 3px;
      border-color: ${theme.colors.attention};
    `}
`
