import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getBooksByISBN } from '../api/books';
import { addToDatabase } from '../api/books';

const list = () => {
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false)

  const handleBarCodeScanned = async ({ type, data }: {type: string, data: string}) => {
    console.log('(list.tsx) [Line 12]: ', "\x1b[32m\x1b[1m=============================================\x1b[0m\n");
    setScanned(true);
    setShowScanner(false);
    const code = data
    const bookData = await getBooksByISBN(code)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
  };

  return (
    <View style={styles.container}>
      {showScanner && <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />}
      <TouchableOpacity style={styles.fab} onPress={() => setShowScanner(true)}>
        <Text style={styles.fabIcon}>+</Text>
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
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
})

export default list;