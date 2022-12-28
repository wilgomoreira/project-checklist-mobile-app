import React, { useState, useContext } from 'react'
import { TouchableHighlight } from 'react-native'
import { Container, Logo, TitleArea, Title, Input, CenterView, Button, ButtonText, List } from './styles'
import ItemQuestion from '../../Components/ItemQuestion';

import { ChecklistContext } from '../../contexts/ChecklistContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function Questions() {
  const [question, setQuestion] = useState('');
  const [indexEdit, setIndexEdit] = useState(0)
  const { questions, setQuestions, results, setResults, comments, setComments, photos, setPhotos, 
    photosSnaped, setPhotosSnaped, getObjetcsAsync, OrderObjects } = useContext(ChecklistContext);

  function addElement() {
    let questionAdd = question
    let listQuestions = questions
    let hasDuplicate = false
    let situation = 'NOT APPLIED'
    let commentEmpty = ''
    let photoNull = null
    let photoSnaped = false

    if (question === '') return

    listQuestions.forEach(element => {
      if (element === question) {
        alert('Duplicate Question')
        hasDuplicate = true
        setQuestion('')
        return
      }
    });

    if (hasDuplicate) return

    setQuestions(oldQuestions => [...oldQuestions, questionAdd])
    setResults(oldResults => [...oldResults, situation])
    setComments(oldComments => [...oldComments, commentEmpty])
    setPhotos(oldPhotos => [...oldPhotos, photoNull])
    setPhotosSnaped(oldPhotosSnaped => [...oldPhotosSnaped, photoSnaped])
    setQuestion("")

    salveAsyncDatabase(questionAdd, situation, commentEmpty, photoNull, photoSnaped)
  }

  async function salveAsyncDatabase(questionAdd, situation, commentEmpty, photoNull, photoSnaped) {
    const id = uuid.v4();

    const data = {
      id: id,
      question: questionAdd,
      createdAt: new Date(),
      result: situation,
      comment: commentEmpty,
      photo: photoNull,
      photoSnaped: photoSnaped
    }

    try {
      await AsyncStorage.setItem(id, JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  }

  function handleGetEdit(index) {
    setQuestion(() => questions[index])
    setIndexEdit(() => index)
  }

  function handleEdit() {
    let newQuestions = questions

    if (question === '') return

    if (indexEdit >= 0)
      newQuestions[indexEdit] = question

    setQuestions(() => [...newQuestions])
    updateAsyncDatabase()
  }

  async function updateAsyncDatabase() {
    let updateQuestion = question

    const objects = await getObjetcsAsync()
    const oderForCreated = OrderObjects(objects)

    const id = oderForCreated[indexEdit].id
    const newObject = { ...oderForCreated[indexEdit], question: updateQuestion }

    try {
      await AsyncStorage.setItem(id, JSON.stringify(newObject))
    } catch (e) {
      console.log(e)
    }

  }

  function handleDelete(index) {
    let newQuestions = questions
    let newResults = results
    let newComments = comments
    let newPhotos = photos
    let newPhotosSnaped = photosSnaped

    newQuestions.splice(index, 1)
    newResults.splice(index, 1)
    newComments.splice(index, 1)
    newPhotos.splice(index, 1)
    newPhotosSnaped.splice(index, 1)

    setQuestions(() => [...newQuestions])
    setResults(() => [...newResults])
    setComments(() => [...newComments])
    setPhotos(() => [...newPhotos])
    setPhotosSnaped(() => [...newPhotosSnaped])

    deleteInAsyncDatabase(index)
  }

  async function deleteInAsyncDatabase(index) {

    const objects = await getObjetcsAsync()
    const oderForCreated = OrderObjects(objects)

    const idQuestion = oderForCreated[index].id

    try {
      await AsyncStorage.removeItem(idQuestion)
    } catch (e) {
      console.log(e);
    }
  }

  async function handleClear() {
    try {
      await AsyncStorage.clear()
    } catch (e) {
      console.log(e)
    }

    setQuestions(() => [])
    setResults(() => [])
    setComments(() => [])
    setPhotos(() => [])
    setPhotosSnaped(() => [])
  }

  return (
    <Container>
      <TitleArea>
        <Logo>Checklist Questions </Logo>
        <Title>Question: </Title>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          value={question}
          onChangeText={(text) => setQuestion(text)}
        />

        <CenterView>
          <Button onPress={addElement}>
            <ButtonText>Register</ButtonText>
          </Button>

          <Button onPress={handleEdit}>
            <ButtonText>Edit</ButtonText>
          </Button>

          <Button onPress={handleClear}>
            <ButtonText>Clear</ButtonText>
          </Button>
        </CenterView>
      </TitleArea>

      <List
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        data={questions}
        keyExtractor={item => String(Math.floor(Math.random() * 100000000))}
        renderItem={({ item, index }) => (
          <TouchableHighlight onPress={() => handleGetEdit(index)} onLongPress={() => handleDelete(index)} activeOpacity={1} underlayColor='#eee'>
            <ItemQuestion number={index} question={item} />
          </TouchableHighlight>
        )}
      />

    </Container>
  )
}