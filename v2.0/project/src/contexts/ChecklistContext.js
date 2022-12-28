import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChecklistContext = createContext({});

export default function ChecklistProvider({ children }) {
    const [questions, setQuestions] = useState([])
    const [results, setResults] = useState([])
    const [comments, setComments] = useState([])
    const [photos, setPhotos] = useState([])
    const [photosSnaped, setPhotosSnaped] = useState([])

    useEffect(() => {
        async function loadChecklist() {
            let listQuestions = []
            let listResults = []
            let listComments = []
            let listPhotos = []
            let listPhotosSnaped = []

            const objects = await getObjetcsAsync()
            const orderForCreated = OrderObjects(objects)

            orderForCreated?.forEach(item => {
              listQuestions.push(item.question)
              listResults.push(item.result)
              listComments.push(item.comment)
              listPhotos.push(item.photo)
              listPhotosSnaped.push(item.photoSnaped)
            })

            setQuestions(() => [...listQuestions])
            setResults(() => [...listResults])
            setComments(() => [...listComments])
            setPhotos(() => [...listPhotos])
            setPhotosSnaped(() => [...listPhotosSnaped])
        }
        loadChecklist();
        
    }, []);

    async function getObjetcsAsync() {
        let keys, objects = []
    
        try {
          keys = await AsyncStorage.getAllKeys()
        } catch (e) {
          console.log(e)
        }
    
        for (let i = 0; i < keys.length; i++) {
          try {
            const value = await AsyncStorage.getItem(keys[i])
            objects.push(JSON.parse(value))
          } catch (e) {
            console.log(e)
          }
        }
    
        return objects
      }
    
      function OrderObjects(objects) {
    
        function compare(a, b) {
          if (a.createdAt < b.createdAt)
            return -1;
          if (a.createdAt > b.createdAt)
            return 1;
          return 0;
        }
    
        const oderForCreated = objects.sort(compare)
        return oderForCreated
      }

    return (
        <ChecklistContext.Provider value={{ questions, setQuestions, results, setResults, comments, setComments, 
            photos, setPhotos, photosSnaped, setPhotosSnaped, getObjetcsAsync, OrderObjects }}>
            {children}
        </ChecklistContext.Provider>
    )
}