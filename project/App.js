import React from 'react'
import { StatusBar } from 'react-native'
import Routes from './src/routes'

import ChecklistProvider from './src/contexts/ChecklistContext'

export default function App() {
  return (
    <ChecklistProvider>
      <StatusBar barStyle='light-content' />
      <Routes />
    </ChecklistProvider>
  )
}