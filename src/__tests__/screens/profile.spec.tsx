import React from 'react'
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'

describe('Profile Screen', () => {
  it('renders correctly name input placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />)

    const inputName = getByPlaceholderText('Nome')

    expect(inputName.props.placeholder).toBeTruthy()
  })
  it('loads user data', () => {
    const { getByTestId } = render(<Profile />)

    const inputName = getByTestId('input-name')
    const inputSurname = getByTestId('input-surname')

    expect(inputName.props.value).toEqual('Gabriel')
    expect(inputSurname.props.value).toEqual('Paiva')
  })
  it('render title correctly', () => {
    const { getByTestId } = render(<Profile />)

    const textTitle = getByTestId('text-title')

    expect(textTitle.props.children).toContain('Perfil')
  })
})
