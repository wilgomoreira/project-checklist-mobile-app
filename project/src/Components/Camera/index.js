import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform } from "react-native";


import { RNCamera } from 'react-native-camera'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { launchImageLibrary } from 'react-native-image-picker';


export default function Camera({ route }) {

  const [type, setType] = useState(RNCamera.Constants.Type.back)
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const { getUri } = route.params;


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
    const options = { quality: 0.5, base64: true }
    const data = await camera.takePictureAsync(options);

    setCapturedPhoto(data.uri)
    setOpen(true);
    savePicture(data.uri)
    getUri(data.uri)
  }

  async function savePicture(data) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(data, 'photo')
      .then((res) => {
        alert('Salved')

      })
      .catch((erro) => console.log('Erro em algo ' + erro))
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
        getUri(response.assets[0].uri);
      }

    })
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

      <View style={styles.camPosition}>
        <TouchableOpacity onPress={toggleCam}>
          <Text> CHANGE </Text>
        </TouchableOpacity>
      </View>

      {capturedPhoto &&
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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