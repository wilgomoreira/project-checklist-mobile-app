import React, { useState } from 'react'
import { ScrollView, LogBox } from 'react-native'
import { Container, Title } from './styles'
import ItemChecklist from '../../Components/ItemChecklist'

LogBox.ignoreAllLogs()  //ignore warnings

export default function Home() {

  let data = [
    { question: "Is equipament clean? " },
    { question: "Is the equipment making a strange noise? "},
    { question: "Is equipment crushed? "},
  ]

  return (
    <Container>
      <Title> Equipament Checklist </Title>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        {
          data?.map((item, index) => (
            <ItemChecklist number={index} data={item} />
          ))
        }
      </ScrollView>
    </Container>
  )
}