import React, { useState, useContext } from 'react'
import { TouchableHighlight } from 'react-native'
import { Container, Logo, TitleArea, Title, Input, CenterView, Button, ButtonText, List } from './styles'
import ItemQuestion from '../../Components/ItemQuestion';

import { ChecklistContext } from '../../contexts/ChecklistContext'
import firestore from '@react-native-firebase/firestore';

export default function Questions() {
  const [question, setQuestion] = useState('');
  const [indexEdit, setIndexEdit] = useState(0)
  const { questions, setQuestions, results, setResults, comments, setComments, photos, setPhotos } = useContext(ChecklistContext);
 
  function addElement() {
    let questionAdd = question
    let listQuestions = questions
    let hasDuplicate = false
    let situation = 'NOT APPLIED'
    let commentEmpty = ''
    let photoNull = null

    if(question === '') return

    listQuestions.forEach(element => {
        if(element === question){
          alert('Duplicate Question')
          hasDuplicate = true
          setQuestion('')
          return
        }
    });

    if(hasDuplicate) return

    setQuestions(oldQuestions => [...oldQuestions, questionAdd])
    setResults(oldResults => [...oldResults, situation])
    setComments(oldComments => [...oldComments, commentEmpty])
    setPhotos(oldPhotos => [...oldPhotos, photoNull])
    setQuestion("")

    salveDatabase(questionAdd, situation, commentEmpty, photoNull)
  }

  async function salveDatabase(questionAdd, situation, commentEmpty, photoNull){
    await firestore().collection('Checklist').add({
      question: questionAdd,
      createdAt: firestore.FieldValue.serverTimestamp(),
      result: situation,
      comment: commentEmpty,
      photo: photoNull
    })
    .then((snapshot) => {
      console.log(snapshot.id);
    });
  }

  function handleGetEdit(index){
    setQuestion(() => questions[index])
    setIndexEdit(() => index)
  }

  function handleEdit(){
    let newQuestions = questions

    if(question === '') return
    
    if(indexEdit >= 0)
      newQuestions[indexEdit] = question

    setQuestions(() => [...newQuestions])
    updateDatabase()
  }

  async function updateDatabase(){
    let idQuestion;
    let updateQuestion = question

    await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
        .then(querySnapshot => {
          idQuestion = querySnapshot?.docs[indexEdit].id
    });

    await firestore().collection('Checklist').doc(idQuestion).update({
      question: updateQuestion
    })
    .then(() => {
      console.log('Question updated!');
    });
  }

  function handleDelete(index){
    let newQuestions = questions
    let newResults = results
    let newComments = comments
    let newPhotos = photos

    newQuestions.splice(index, 1)
    newResults.splice(index,1)
    newComments.splice(index, 1)
    newPhotos.splice(index, 1)

    setQuestions(() => [...newQuestions])    
    setResults(() => [...newResults])    
    setComments(() => [...newComments])    
    setPhotos(() => [...newPhotos])

    deleteInDatabase(index)
  }

  async function deleteInDatabase(index){
    let idQuestion;

    await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
        .then(querySnapshot => {
          idQuestion = querySnapshot?.docs[index].id
    });

    await firestore().collection('Checklist').doc(idQuestion).delete()
        .then(() => {
          console.log('Deleted in Database');
    });
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
        </CenterView>
      </TitleArea>

      <List
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        data={questions}
        keyExtractor={item => String(Math.floor(Math.random() * 100000000))}
        renderItem={({ item, index }) => (
          <TouchableHighlight onPress={() => handleGetEdit(index)} onLongPress={()=> handleDelete(index)} activeOpacity={1} underlayColor='#eee'>
            <ItemQuestion number={index} question={item} />
          </TouchableHighlight>
        )}
      />

    </Container>
  )
}