import React, { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryPie } from 'victory-native'
import { ActivityIndicator } from 'react-native'

import { HistoryCard } from '../../components/HistoryCard'
import {
  Container,
  Content,
  Header,
  Title,
  ChartContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  LoadContainer
} from './styles'
import { useFocusEffect } from '@react-navigation/core'
import { categories } from '../../utils/categories'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '../../hooks/auth'

type TransactionData = {
  transactionType: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

type CategoryData = {
  name: string
  rawTotal: number
  total: string
  color: string
  key: string
  percent: string
}

export function Summary() {
  const [isLoading, setIsLoading] = useState(false)
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  const theme = useTheme()

  const { user } = useAuth()

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = `@gofinances:transactions_user:${user.id}`
    const rawResponse = await AsyncStorage.getItem(dataKey)
    const response: TransactionData[] = rawResponse
      ? JSON.parse(rawResponse)
      : []

    const expenditures = response.filter(
      expenditure =>
        expenditure.transactionType === 'negative' &&
        new Date(expenditure.date).getMonth() === selectedDate.getMonth() &&
        new Date(expenditure.date).getFullYear() === selectedDate.getFullYear()
    )

    const expendituresTotal = expenditures.reduce(
      (acumullator: number, expenditure) => {
        return acumullator + Number(expenditure.amount)
      },
      0
    )

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenditures.forEach(expenditure => {
        if (expenditure.category === category.key) {
          categorySum += Number(expenditure.amount)
        }
      })
      if (categorySum > 0) {
        const percent = `${((categorySum / expendituresTotal) * 100).toFixed(
          0
        )}%`
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          rawTotal: categorySum,
          percent
        })
      }
    })
    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }
  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  )
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>
            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={85}
              x="percent"
              y="rawTotal"
            />
          </ChartContainer>
          {totalByCategories.map(item => (
            <HistoryCard
              title={item.name}
              amount={item.total}
              color={item.color}
              key={item.key}
            />
          ))}
        </Content>
      )}
    </Container>
  )
}
