import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router'



export default function TabOneScreen() {
  return <Redirect href="/list" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
