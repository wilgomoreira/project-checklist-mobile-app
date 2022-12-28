import React, { useState, useContext } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity, Image
} from 'react-native';
import { ChecklistContext } from '../../contexts/ChecklistContext'

import { htmlChecklist } from './html'

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

import imgPrinter from '../../assets/printer.png'

export default function Print() {
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const { questions, results, comments, photos, photosSnaped } = useContext(ChecklistContext);

   // Only for iOS
  const selectPrinter = async () => {
    const selectedPrinter =
      await RNPrint.selectPrinter({ x: 100, y: 100 });
    setSelectedPrinter(selectedPrinter);
  };

  // Only for iOS
  const silentPrint = async () => {
    if (!selectedPrinter) {
      alert('Must Select Printer First');
    }
    const jobName = await RNPrint.print({
      printerURL: selectedPrinter.url,
      html: '<h1>Silent Print clicked</h1>',
    });
  };

  const printHTML = async () => {
    try{
      await RNPrint.print({
        html: await htmlChecklist(questions, results, comments, photos, photosSnaped)
      });
    }catch(error){
      console.log("Error to print: " + error.message);
    }
  };

  // const printPDF = async () => {
  //   const results = await RNHTMLtoPDF.convert({
  //     html: '<h1>Demo Text to converted to PDF</h1>',
  //     fileName: 'checklist',
  //     base64: true,
  //   });
  //   await RNPrint.print({ filePath: results.filePath });
  // };

  const customOptions = () => {
    return (
      <View>
        {selectedPrinter && (
          <View>
            <Text>
              {`Selected Printer Name: ${selectedPrinter.name}`}
            </Text>
            <Text>
              {`Selected Printer URI: ${selectedPrinter.url}`}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={selectPrinter}>
          <Text>Click to Select Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={silentPrint}>
          <Text>Click for Silent Print</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.titleText}>
        Print Ckecklist
      </Text>
      <View style={styles.container}>
        {Platform.OS === 'ios' && customOptions()}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={printHTML}>
          <View>
            <Image source={imgPrinter} style={styles.img} resizeMode="contain" />
          </View>
          <View style={styles.buttonArea}>
            <Text style={styles.buttonText}> Click here to Print </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.buttonStyle}
          onPress={printPDF}>
          <Text style={styles.buttonText}>Click to Print PDF</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#1B2B42'
  },
  buttonStyle: {
    padding: 10,
    width: 200,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    backgroundColor: '#1B2B42',
    borderRadius: 10,
    height: 30,
    width: 150,
  },
  img:{
    width: '90%',
    height: 150,
  },
  buttonArea:{
    marginTop: 30,
    flex: 1,
  }
});