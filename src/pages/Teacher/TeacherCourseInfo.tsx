import React, {useEffect, useState} from 'react';
import Title from '../../components/Title';
import Attendance from '../Attendance';
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
import Listeners from './Listeners';

function TeacherCourseInfo({route, navigation}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(route.params);
  }, []);
  return (
    <View style={styles.container}>
      <Title title={route.params.cname} />
      <TouchableOpacity
        onPress={() => navigation.navigate('Listeners', route.params)}>
        <View style={styles.box}>
          <Text style={styles.font}>학생정보</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Attendance', route.params)}>
        <View style={styles.box}>
          <Text style={styles.font}>출석현황</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Attendance', route.params)}>
        <View style={styles.box}>
          <Text style={styles.font}>테스트 결과</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BoardList', {courseId: route.params.id})
        }>
        <View style={styles.box}>
          <Text style={styles.font}>과제</Text>
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

export default TeacherCourseInfo;
