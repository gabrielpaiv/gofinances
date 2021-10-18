import React, { useState } from 'react'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from '../../components/Form/Button'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'
import { InputForm } from '../../components/Form/InputForm'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelect } from '../CategorySelect'
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsType
} from './styles'

type FormData = {
  name: string
  amount: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
})

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  })
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }

    const data = {
      name: form.name,
      amount: form.amount,
      category: category.key,
      transactionType
    }

    console.log(data)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsType>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => setTransactionType('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => setTransactionType('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionsType>
            <CategorySelectButton
              title={category.name}
              onPress={() => setCategoryModalOpen(true)}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={() => setCategoryModalOpen(false)}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
