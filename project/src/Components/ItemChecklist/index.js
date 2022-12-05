import React, { useState } from 'react'
import { ChecklistArea, Question, CameraArea, ImageCamera, ButtonArea, ResultArea, 
    SituationText, ObsInput, ChooseText, ObsArea, ObsText } from './styles'
import Feather from 'react-native-vector-icons/Feather';
import ImgNotEquipament from '../../assets/notEquipament.png'

import { useNavigation } from '@react-navigation/native'

export default function ItemChecklist({number, data}) {

    const navigation = useNavigation();
    const [uri, setUri] = useState(null)
    const [result, setResult] = useState('NOT APPLIED')

    function snapPhoto() {
        navigation.navigate('Camera', { getUri: setUri })
    }

    function resultOk() {
        setResult('OK')
    }

    function resultNotOk() {
        setResult('NOT OK')
    }

    function resultNotApplied() {
        setResult('NOT APPLIED')
    }

    return (
        <ChecklistArea>
            <Question> {number+1}. {data.question} </Question>
            <CameraArea>

                {
                    uri ? (<ImageCamera source={{ uri: uri }} resizeMode="contain" />) : (<ImageCamera source={ImgNotEquipament} resizeMode="contain" />)
                }

                <ButtonArea>
                    <Feather.Button name='camera' size={20} backgroundColor='#1B2B42' onPress={snapPhoto}> photo </Feather.Button>

                    <ChooseText> SITUATION: </ChooseText>
                    <Feather.Button name='check-circle' size={20} backgroundColor='#125618' onPress={resultOk}> ok </Feather.Button>
                    <Feather.Button name='x' size={20} backgroundColor='#561c12' onPress={resultNotOk}> not ok </Feather.Button>
                    <Feather.Button name='crosshair' size={20} backgroundColor='#6c757f' onPress={resultNotApplied}> not applied </Feather.Button>
                </ButtonArea>
            </CameraArea>
            {
                result === "OK" && (
                    <ResultArea backgroundColor='#125618'>
                        <SituationText> RESULT: {result} </SituationText>
                        <ObsArea> 
                            <ObsText> Comments: </ObsText>
                            <ObsInput/>
                        </ObsArea>
                    </ResultArea>
                )
            }
            {
                result === "NOT OK" && (
                    <ResultArea backgroundColor='#561c12'>
                        <SituationText> RESULT: {result} </SituationText>
                        <ObsArea> 
                            <ObsText> Comments: </ObsText>
                            <ObsInput/>
                        </ObsArea>
                    </ResultArea>
                )
            }
            {
                result === "NOT APPLIED" && (
                    <ResultArea backgroundColor='#6c757f'>
                        <SituationText> RESULT: {result} </SituationText>
                        <ObsArea> 
                            <ObsText> Comments: </ObsText>
                            <ObsInput/>
                        </ObsArea>
                    </ResultArea>
                )
            }
        </ChecklistArea>
    )
}