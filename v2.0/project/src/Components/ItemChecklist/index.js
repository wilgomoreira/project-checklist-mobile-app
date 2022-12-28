import React, { useState, useContext } from 'react'
import {
    ChecklistArea, Question, CameraArea, ImageCamera, ButtonArea, ResultArea,
    SituationText, ObsInput, ChooseText, ObsArea, ObsText
} from './styles'

import Feather from 'react-native-vector-icons/Feather';
import ImgNotEquipament from '../../assets/notEquipament.png'
import { useNavigation } from '@react-navigation/native'
import { ChecklistContext } from '../../contexts/ChecklistContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemChecklist({ number, question }) {
    const { results, setResults, comments, setComments, photos, setPhotos, photosSnaped, setPhotosSnaped, getObjetcsAsync, OrderObjects } = useContext(ChecklistContext)
    const navigation = useNavigation();

    let situationOptions = {
        situationOK: 'OK',
        situationNotOk: 'NOT OK',
        situationNotApplied: 'NOT APPLIED'
    }

    function snapPhoto() {
        navigation.navigate('Camera', { index: number })
    }

    function removePhoto() {
        let listPhotos = photos
        let listPhotosSnaped = photosSnaped
        
        listPhotos[number] = null
        listPhotosSnaped[number] = false
        
        setPhotos(() => [...listPhotos])
        setPhotosSnaped(() => [...listPhotosSnaped])
        removeAsyncData()
    }

    async function removeAsyncData(){
        const objects = await getObjetcsAsync()
        const oderForCreated = OrderObjects(objects)

        const idPhoto = oderForCreated[number].id
        const newObject = { ...oderForCreated[number], photo: null, photoSnaped: false}

        try {
            await AsyncStorage.setItem(idPhoto, JSON.stringify(newObject))
        } catch (e) {
            console.log(e)
        }

    }

    function handleInput(text) {
        let newComments = comments
        newComments[number] = text
        setComments(() => [...newComments])
        salveAsyncComments(text)
    }

    async function salveAsyncComments(text){
        const objects = await getObjetcsAsync()
        const oderForCreated = OrderObjects(objects)

        const idComment = oderForCreated[number].id
        const newObject = { ...oderForCreated[number], comment: text}

        try {
            await AsyncStorage.setItem(idComment, JSON.stringify(newObject))
        } catch (e) {
            console.log(e)
        }
    }

    function resultSituation(selectedSituation){
        let situation = situationOptions[selectedSituation]
        let newResults = results
        newResults[number] = situation

        setResults(() => [...newResults])
        salveAsyncResults(situation)
    }

    async function salveAsyncResults(situation){
        const objects = await getObjetcsAsync()
        const oderForCreated = OrderObjects(objects)

        const idResult = oderForCreated[number].id
        const newObject = { ...oderForCreated[number], result: situation}

        try {
            await AsyncStorage.setItem(idResult, JSON.stringify(newObject))
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <ChecklistArea>
            <Question> {number + 1}. {question} </Question>
            <CameraArea>
                {
                    photos[number] ? (<ImageCamera source={{ uri: photos[number] }} resizeMode="contain" />) : (<ImageCamera source={ImgNotEquipament} resizeMode="contain" />)
                }

                <ButtonArea>
                    <Feather.Button name='camera' size={20} backgroundColor='#1B2B42' onPress={snapPhoto}> Photo </Feather.Button>
                    <Feather.Button name='trash-2' size={20} backgroundColor='#f86868' onPress={removePhoto}> Remove </Feather.Button>

                    <ChooseText> SITUATION: </ChooseText>
                    <Feather.Button name='check' size={20} backgroundColor='#0fb87b' onPress={() => resultSituation('situationOK')}> Ok </Feather.Button>
                    <Feather.Button name='x' size={20} backgroundColor='#f86868' onPress={() => resultSituation('situationNotOk')}> Not Ok </Feather.Button>
                    <Feather.Button name='chevrons-right' size={20} backgroundColor='#6c757f' onPress={() => resultSituation('situationNotApplied')}> Not Applied </Feather.Button>
                </ButtonArea>
            </CameraArea>
            {
                results[number] === situationOptions['situationOK'] && (
                    <ResultArea backgroundColor='#0fb87b'>
                        <SituationText> RESULT: {results[number]} </SituationText>
                        <ObsArea>
                            <ObsText> Comments: </ObsText>
                            <ObsInput onChangeText={(text) => handleInput(text)} value={comments[number]} />
                        </ObsArea>
                    </ResultArea>
                )
            }
            {
                results[number] === situationOptions['situationNotOk'] && (
                    <ResultArea backgroundColor='#f86868'>
                        <SituationText> RESULT: {results[number]} </SituationText>
                        <ObsArea>
                            <ObsText> Comments: </ObsText>
                            <ObsInput onChangeText={(text) => handleInput(text)} value={comments[number]} />
                        </ObsArea>
                    </ResultArea>
                )
            }
            {
                results[number] === situationOptions['situationNotApplied'] && (
                    <ResultArea backgroundColor='#6c757f'>
                        <SituationText> RESULT: {results[number]} </SituationText>
                        <ObsArea>
                            <ObsText> Comments: </ObsText>
                            <ObsInput onChangeText={(text) => handleInput(text)} value={comments[number]} />
                        </ObsArea>
                    </ResultArea>
                )
            }
        </ChecklistArea>
    )
}