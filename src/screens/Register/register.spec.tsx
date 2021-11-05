import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { Register } from '.'
import { ThemeProvider } from 'styled-components/native'
import theme from '../../global/styles/theme'

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('Register Screen', () => {
  it('must open category modal when user click on the category button', () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Providers
    })

    const categoryModal = getByTestId('category-modal')
    const categoryButton = getByTestId('category-button')

    expect(categoryModal.props.visible).toBeFalsy()

    fireEvent.press(categoryButton)

    expect(categoryModal.props.visible).toBeTruthy()
  })
})
