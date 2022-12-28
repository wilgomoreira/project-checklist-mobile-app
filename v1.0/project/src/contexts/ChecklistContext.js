import React, { createContext, useState, useEffect } from "react";
import firestore from '@react-native-firebase/firestore';

export const ChecklistContext = createContext({});

export default function ChecklistProvider({ children }) {
    const [questions, setQuestions] = useState([])
    const [results, setResults] = useState([])
    const [comments, setComments] = useState([])
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        async function loadChecklist() {
            let listQuestions = []
            let listResults = []
            let listComments = []
            let listPhotos = []

            await firestore().collection('Checklist').orderBy('createdAt', 'asc').get()
                .then(querySnapshot => {
                    querySnapshot?.docs.forEach(item => {
                        listQuestions.push(item.data().question)
                        listResults.push(item.data().result)
                        listComments.push(item.data().comment)
                        listPhotos.push(item.data().photo)
                    })
                });

            setQuestions(() => [...listQuestions])
            setResults(() => [...listResults])
            setComments(() => [...listComments])
            setPhotos(() => [...listPhotos])
        }
        loadChecklist();
        
    }, []);

    return (
        <ChecklistContext.Provider value={{ questions, setQuestions, results, setResults, comments, setComments, photos, setPhotos }}>
            {children}
        </ChecklistContext.Provider>
    )
}