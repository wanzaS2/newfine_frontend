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
  Pressable,
  Dimensions,
} from 'react-native';
// import {ranking} from '../slices/ranking';
// import EachRanking from '../components/EachRanking';
import Config from 'react-native-config';
import axios from 'axios';
import Listeners from './Listeners';
import teacherCourseInfo from '../../assets/mock/teacherCourseInfo.json';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import teacherService from '../../assets/mock/teacherService.json';
import ColorfulCard from 'react-native-colorful-card';

type TeacherCourseInfoScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'TeacherCourseInfo'
>;

const screenHeight = Dimensions.get('window').height;

function TeacherCourseInfo({route, navigation}: TeacherCourseInfoScreenProps) {
  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '3%', flex: 1}}>
        <View style={{marginLeft: '40%', flex: 1}}>
          <Text style={styles.courseName}> #내신 미적분</Text>
        </View>
        {/*<Title title={route.params.cname} />*/}
        <View style={styles.buttonArea}>
          <FlatList
            contentContainerStyle={{
              marginTop: 10,
              flex: 1,
              // backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={teacherCourseInfo}
            renderItem={({item, index}) => (
              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate(item.onPress, route.params)}>
                <View style={styles.box}>
                  <Text style={styles.font}>{item.name}</Text>
                </View>
              </Pressable>
            )}
            numColumns={2}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  buttonArea: {
    flex: 11,
    // marginTop: '15%',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'yellow',
    width: '45%',
    // height: '80%',
    marginHorizontal: '2%',
    marginVertical: '10%',
  },
  box: {
    borderRadius: 10,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    // width: '100%',
    // height: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseName: {
    fontSize: 22,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
    // backgroundColor: 'lightyellow',
    // marginRight: 250,
  },
});

export default TeacherCourseInfo;
