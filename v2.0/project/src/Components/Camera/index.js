import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform } from "react-native";

import { RNCamera } from 'react-native-camera'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { launchImageLibrary } from 'react-native-image-picker';

import { ChecklistContext } from '../../contexts/ChecklistContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Camera({ route }) {

  const [type, setType] = useState(RNCamera.Constants.Type.back)
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const { photos, setPhotos, photosSnaped, setPhotosSnaped, getObjetcsAsync, OrderObjects  } = useContext(ChecklistContext)
  const { index } = route.params;

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted'
  }

  function toggleCam() {
    return type === RNCamera.Constants.Type.back ? setType(RNCamera.Constants.Type.front) : setType(RNCamera.Constants.Type.back);
  }

  async function takePicture(camera) {
    const options = { quality: 0.5, base64: true}
    const data = await camera.takePictureAsync(options);

    setCapturedPhoto(data.uri)
    setOpen(true);
    savePicture(data.uri)
    photoSnapedAndSalveDatabase(data.uri)
  }

  async function savePicture(data) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(data, 'photo')
      .then((res) => {
      })
      .catch((erro) => console.log('Erro em algo ' + erro))
  }


  function photoSnapedAndSalveDatabase(uri){
    let newPhotos = photos
    let newPhotosSnaped = photosSnaped
    
    newPhotos[index] = uri
    newPhotosSnaped[index] = true

    setPhotos(() => [...newPhotos])
    setPhotosSnaped(() => [...newPhotosSnaped])
    salvePhotoSnapedAsync(uri)
  }

  async function salvePhotoSnapedAsync(newPhoto){
    const objects = await getObjetcsAsync()
    const oderForCreated = OrderObjects(objects)

    const idPhoto = oderForCreated[index].id
    const newObject = { ...oderForCreated[index], photo: newPhoto, photoSnaped: true}

    try {
        await AsyncStorage.setItem(idPhoto, JSON.stringify(newObject))
    } catch (e) {
        console.log(e)
    }
  }

  function openAlbum() {
    const options = {
      title: 'Choose the photo',
      chooseFromLibraryButtonTitle: 'Searching the photo...',
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Cancel search for photo");
      } else if (response.error) {
        console.log("error: " + response.error);
      } else {
        setCapturedPhoto(response.assets[0].uri);
        setOpen(true);
        photoOfAlbumAndSalveDatabase(response.assets[0].uri)
      }
    })
  }

  function photoOfAlbumAndSalveDatabase(uri){
    let newPhotos = photos
    newPhotos[index] = uri

    setPhotos(() => [...newPhotos])
    salvePhotoAlbumAsync(uri)
  }

  async function salvePhotoAlbumAsync(newPhoto){
    const objects = await getObjetcsAsync()
    const oderForCreated = OrderObjects(objects)

    const idPhoto = oderForCreated[index].id
    const newObject = { ...oderForCreated[index], photo: newPhoto}

    try {
        await AsyncStorage.setItem(idPhoto, JSON.stringify(newObject))
    } catch (e) {
        console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <RNCamera
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: "Permission to use the Camera",
          message: "Need to use the Camera",
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status, recordAndroidPermissionStatus }) => {
          if (status !== "READY") return <View />;

          return (
            <View style={{ marginBottom: 35, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>

              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}
              >
                <Text> SNAP </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openAlbum()}
                style={styles.capture}
              >
                <Text> Album </Text>
              </TouchableOpacity>

            </View>
          )
        }
        }
      </RNCamera>

      {/* <View style={styles.camPosition}>
        <TouchableOpacity onPress={toggleCam}>
          <Text> CHANGE </Text>
        </TouchableOpacity>
      </View> */}

      {capturedPhoto &&
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => setOpen(false)}>
              <Text style={{ fontSize: 24 }}> CLOSE </Text>
            </TouchableOpacity>

            <Image
              source={{ uri: capturedPhoto }}
              resizeMode="contain"
              style={{ width: 450, height: 450, borderRadius: 15 }}
            />
          </View>
        </Modal>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },
  camPosition: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    height: 40,
    position: 'absolute',
    right: 25,
    top: 50
  }
})