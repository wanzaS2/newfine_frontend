import React, {useEffect, useState} from 'react';
import Title from '../../components/Title';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Config from 'react-native-config';
import axios from 'axios';
import StudyIn from './StudyIn';
import StudyOut from './StudyOut';
import StudyTime from './StudyTime';

function Study({route, navigation}) {
  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <Title title="자습" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StudyIn');
        }}>
        <View style={styles.box}>
          <Text style={styles.font}>입실</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StudyOut');
        }}>
        <View style={styles.box}>
          <Text style={styles.font}>퇴실</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StudyTime');
        }}>
        <View style={styles.box}>
          <Text style={styles.font}>자습시간</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    backgroundColor: 'green',
  },
  box: {
    borderRadius: 10,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0ffff',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  font: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Study;
