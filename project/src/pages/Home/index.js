import React, { useEffect, useContext } from 'react'
import { ScrollView, LogBox } from 'react-native'
import { Container, Title } from './styles'
import ItemChecklist from '../../Components/ItemChecklist'

import { ChecklistContext } from '../../contexts/ChecklistContext'

LogBox.ignoreAllLogs()  //ignore warnings

export default function Home() {
  const { questions } = useContext(ChecklistContext)

  return (
    <Container>
      <Title> Equipament Checklist </Title>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        {
          questions?.map((item, index) => (
            <ItemChecklist key={index} number={index} question={item} />
          ))
        }
      </ScrollView>
    </Container>
  )
}