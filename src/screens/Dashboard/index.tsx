import React, { useState, useCallback } from 'react'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { HighlightCard } from '../../components/HighlightCard'
import {
  TransactionCard,
  TransactionCardProps
} from '../../components/TransactionCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from 'styled-components'

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './styles'
import { useAuth } from '../../hooks/auth'

export interface DataListProps extends TransactionCardProps {
  id: string
}

type Highlight = {
  amount: string
  lastTransaction: string
}

type HighlightData = {
  entries: Highlight
  expenditures: Highlight
  total: Highlight
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  )

  const theme = useTheme()
  const { signOut, user } = useAuth()

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter(item => item.transactionType === type)
          .map(item => {
            return new Date(item.date).getTime()
          })
      )
    )

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`
  }

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const rawTransactions: DataListProps[] = response
      ? JSON.parse(response)
      : []

    let totalEntries = 0
    let totalExpenditures = 0

    const transactions: DataListProps[] = rawTransactions.map(
      (item: DataListProps) => {
        if (item.transactionType === 'positive') {
          totalEntries += Number(item.amount)
        } else {
          totalExpenditures += Number(item.amount)
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          transactionType: item.transactionType,
          category: item.category,
          date
        }
      }
    )

    setTransactions(transactions)

    const lastEntry = getLastTransactionDate(rawTransactions, 'positive')
    const lastExpenditure = getLastTransactionDate(rawTransactions, 'negative')
    const totalInterval = `01 à ${lastExpenditure}`

    let total = totalEntries - totalExpenditures

    setHighlightData({
      entries: {
        amount: totalEntries.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastEntry}`
      },
      expenditures: {
        amount: totalExpenditures.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastExpenditure}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })

    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expenditures.amount}
              lastTransaction={highlightData.expenditures.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total?.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
