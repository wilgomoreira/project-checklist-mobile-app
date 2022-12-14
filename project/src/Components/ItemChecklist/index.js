import React, { useState, useContext } from 'react'
import {
    ChecklistArea, Question, CameraArea, ImageCamera, ButtonArea, ResultArea,
    SituationText, ObsInput, ChooseText, ObsArea, ObsText
} from './styles'

import Feather from 'react-native-vector-icons/Feather';
import ImgNotEquipament from '../../assets/notEquipament.png'
import { useNavigation } from '@react-navigation/native'
import { ChecklistContext } from '../../contexts/ChecklistContext';

import firestore from '@react-native-firebase/firestore';

export default function ItemChecklist({ number, question }) {
    const { results, setResults, comments, setComments, photos, setPhotos } = useContext(ChecklistContext)
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
        listPhotos[number] = null
        setPhotos(() => [...listPhotos])
        removePhotoDatabase()
    }

    async function removePhotoDatabase() {
        let idPhoto

        await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
            .then(querySnapshot => {
                idPhoto = querySnapshot?.docs[number].id
            });

        await firestore().collection('Checklist').doc(idPhoto).update({
            photo: null
        })
            .then(() => {
                console.log('Photo Removed!');
            });
    }

    function handleInput(text) {
        let newComments = comments
        newComments[number] = text
        setComments(() => [...newComments])
        salveCommentsDatabase(text)
    }

    async function salveCommentsDatabase(text) {
        let idComment

        await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
            .then(querySnapshot => {
                idComment = querySnapshot?.docs[number].id
            });

        await firestore().collection('Checklist').doc(idComment).update({
            comment: text
        })
            .then(() => {
                console.log('Comments Salved!');
            });
    }

    function resultSituation(selectedSituation){
        let situation = situationOptions[selectedSituation]
        let newResults = results
        newResults[number] = situation

        setResults(() => [...newResults])
        salveResultsDatabase(situation)
    }

    async function salveResultsDatabase(situation) {
        let idResult

        await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
            .then(querySnapshot => {
                idResult = querySnapshot?.docs[number].id
            });

        await firestore().collection('Checklist').doc(idResult).update({
            result: situation
        })
            .then(() => {
                console.log('Result Salved!');
            });
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