import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
// import {ranking} from '../slices/ranking';
// import EachRanking from '../components/EachRanking';
import Config from 'react-native-config';
import axios from 'axios';
import QRCodeScanner from './QRCodeScanner';

function AttendanceInfo({navigation}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <Title title="출석현황" />
      <TouchableOpacity onPress={() => navigation.navigate('QRCodeScanner')}>
        <View style={styles.box}>
          <Text style={styles.font}>지금 출석하기</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('VideoList')}>
        <View style={styles.box}>
          <Text style={styles.font}>동영상신청</Text>
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

export default AttendanceInfo;
