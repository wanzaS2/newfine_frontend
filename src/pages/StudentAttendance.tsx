import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Fonts} from '../assets/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import Title from '../components/Title';
import Attendance from './Attendance';
import Icon from 'react-native-vector-icons/AntDesign';

function StudentAttendance({route, navigation}) {
  const [Students, setStudents] = useState([]);
  const [listLength, setStudentsLength] = useState();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchItems = () => {
    if (!isRefreshing) {
      getListeners();
    }
  };
  console.log('전달받은 것', route.params);
  const showAlert = item => {
    console.log(item);
    Alert.alert(
      // 말그대로 Alert를 띄운다
      '', // 첫번째 text: 타이틀 제목
      '출석을 변경하시겠습니까?', // 두번째 text: 그 밑에 작은 제목
      [
        // 버튼 배열
        {
          text: '출석', // 버튼 제목
          onPress: () => edit_attendance(item, '출석'), //onPress 이벤트시 콘솔창에 로그를 찍는다
        },
        {text: '결석', onPress: () => edit_attendance(item, '결석')}, //버튼 제목
        // 이벤트 발생시 로그를 찍는다
        {text: '지각', onPress: () => edit_attendance(item, '지각')},
      ],
    );
  };
  const edit_attendance = (id, state) => {
    console.log(id, state);
    axios
      .put(`${Config.API_URL}/teacher/attendance`, {
        id: id,
        state: state,
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error(error))
      .finally();
  };
  const getListeners = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios(`${Config.API_URL}/attendances/student`, {
      params: {id: route.params.attendanceId},
    })
      .then(response => {
        console.log('response', response.data);
        setStudentsLength(response.data.length);
        let attendances = [];
        for (let i = 0; i < response.data.length; i++) {
          // 결석
          if (
            response.data[i].attend == false &&
            response.data[i].islate == false
          ) {
            attendances.push({
              id: response.data[i].sattendanceId,
              name: response.data[i].student.name,
              attend: '결석',
            });
          } else if (
            response.data[i].attend == true &&
            response.data[i].islate == true
          ) {
            attendances.push({
              id: response.data[i].sattendanceId,
              name: response.data[i].student.name,
              attend: '지각',
            });
          } else {
            attendances.push({
              id: response.data[i].sattendanceId,
              name: response.data[i].student.name,
              attend: '출석',
            });
          }
        }
        console.log('attendances', attendances);
        setStudents(attendances);
        console.log(Students);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };
  useEffect(() => {
    getListeners();
    console.log('StudentAttendances : ', Students);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title={route.params.startTime.slice(5, 10)} />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={Students}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            renderItem={({item, index}) => (
              <View
                style={{
                  borderColor: '#eee8aa',
                  borderWidth: 1,
                  padding: 5,
                  backgroundColor: '#ffffe0',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 30,
                    fontSize: 22,
                    color: 'black',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    marginLeft: 120,
                    fontSize: 22,
                    color: 'red',
                  }}>
                  {item.attend}
                </Text>
                <TouchableOpacity onPress={() => showAlert(item.id)}>
                  <Icon
                    name="edit"
                    size={24}
                    color="black"
                    style={{marginLeft: 10, marginTop: 2}}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => String(item.id)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default StudentAttendance;
