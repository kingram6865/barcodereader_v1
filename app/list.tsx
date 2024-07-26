import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getBooksByISBN } from '../api/books';
import { addToDatabase } from '../api/books';
import { addFood } from '@/api/retail';


const list = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showRetailScanner, setShowRetailScanner] = useState(false);
  const [retailSource, setRetailSource] = useState("");
  const [retailDescription, setRetailDescription] = useState("");
  
  const handleBarCodeScanned = async ({ type, data }: {type: string, data: string}) => {
    const bookTypes = ['32', '512']
    console.log('(list.tsx) [Line 12]: ', "\x1b[32m\x1b[1m=============================================\x1b[0m\n");
    setScanned(true);
    setShowScanner(false);
    const code = data
    const bookData = await getBooksByISBN(code)
    alert(`Bar code with type ${type} and isbn ${data} has been scanned!`);

    console.log(bookTypes.includes(type.toString()), bookData.totalItems)
    let restrictions = [bookTypes.includes(type.toString()), (bookData.totalItems > 0)]

    if (restrictions[0] && restrictions[1]) {
      let addResults = await addToDatabase({
        "book_title": bookData.items[0].volumeInfo.title,
        "description": bookData.items[0].volumeInfo.description,
        "isbn": data,
        "subtitle": (bookData.items[0].volumeInfo.subtitle) ? `${bookData.items[0].volumeInfo.subtitle}` : "",
        "authors": JSON.stringify(bookData.items[0].volumeInfo.authors),
        "publisher": bookData.items[0].volumeInfo.publisher,
        "published": bookData.items[0].volumeInfo.publishedDate,
        "pages": bookData.items[0].volumeInfo.pageCount,
        "images": JSON.stringify(bookData.items[0].volumeInfo.imageLinks),
        "industry_codes": JSON.stringify(bookData.items[0].volumeInfo.industryIdentifiers),
        "google_data": JSON.stringify(bookData)
      });
      console.log("\x1b[32m\x1b[1m\n=============================================\x1b[0m\n", `Bar code with type ${type} and data ${data} has been scanned!`)
      console.log(`Google Data: \x1b[35m${bookData.items[0].volumeInfo.title}, ${bookData.items[0].volumeInfo.publisher}, ${bookData.items[0].volumeInfo.publishedDate} ${bookData.items[0].volumeInfo.pageCount} pages\x1b[0m`);
      console.log('(list.tsx) [Line 23]: ', addResults, "\x1b[32m\x1b[1m\n=============================================\x1b[0m\n");
    } else if (!restrictions[0]) {
      console.log(`Bar code with type ${type} and isbn ${data} has been scanned!`)
    // } else {
    //   let message1, message2

    //   message1 = (!restrictions[0]) ? `No execution plan for UPC type ${type}` : `There is an execution plan for type ${type}, but` 
    //   message2 = (!restrictions[1]) ? `There is no data returned by Google Books API` : " but there is data returned by Google Books API"
      
    //   console.log(`${message1} | ${message2}`)
    }

    


  };

  const handleRetailScan = async ({ type, data }: {type: string, data: string}) => {
    setScanned(true);
    setShowRetailScanner(false);
    
    let insertData = {
      codeType: type,
      upcCode: data,
      eanCode: "",
      notes: "Added from Phone Scan."
    }

    alert(`Retail Bar code with type ${type} and UPC ${data} has been scanned!`);    
    let retailScanResult = await addFood({...insertData, source: retailSource, description: retailDescription});
    console.log(retailScanResult)
  }
  return (
    <View style={styles.container}>
      {showScanner && <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />}
      {showRetailScanner && <CameraView
        onBarcodeScanned={scanned ? undefined : handleRetailScan}
        style={StyleSheet.absoluteFillObject}
      />}      
      {/* {showScanner && <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />} */}

      <TextInput 
        style={styles.input1}
        placeholder="Source"
        onChangeText={newText => setRetailSource(newText)}
      />

      <TextInput 
        style={styles.input2}
        placeholder="Description"
        onChangeText={newText => setRetailDescription(newText)}
      />      
      <TouchableOpacity style={styles.fab2} onPress={() => {setShowRetailScanner(true); setScanned(false)} }>
        <Text style={styles.fabIcon}>Retail</Text>
      </TouchableOpacity>      
      <TouchableOpacity style={styles.fab} onPress={() => setShowScanner(true)}>
        <Text style={styles.fabIcon}>Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scanner: {
    height: 200,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fab2: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 90,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 18,
    color: 'white',
  },
  input1: {
    position: 'absolute',
    height: 40,
    right: 100,
    bottom: 120,
    backgroundColor: 'white',
    color: 'black',

  },
  input2: {
    position: 'absolute',
    height: 40,
    right: 100,
    bottom: 90,
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'black'
  },
})

export default list;