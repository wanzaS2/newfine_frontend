import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import Title from '../../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type MyAttendacneScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'MyAttendacne'
>;

function MyAttendance({route, navigation}: MyAttendacneScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [MyAttendance, setMyAttendanceList] = useState();

  const getAttendances = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/attendances/my`, {
      params: {id: route.params.id},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setAttendanceList(response.data);
        setAttendanceLength(response.data.length);

        let attendances = [];
        for (let i = 0; i < response.data.length; i++) {
          // 결석
          if (
            response.data[i].attend == false &&
            response.data[i].islate == false
          ) {
            attendances.push({
              id: response.data[i].sattendanceId,
              time: response.data[i].attendance.startTime.slice(0, 10),
              attend: '결석',
            });
          } else if (
            response.data[i].attend == true &&
            response.data[i].islate == true
          ) {
            attendances.push({
              id: response.data[i].sattendanceId,
              time: response.data[i].attendance.startTime.slice(0, 10),
              attend: '지각',
            });
          } else {
            attendances.push({
              id: response.data[i].sattendanceId,
              time: response.data[i].attendance.startTime.slice(0, 10),
              attend: '출석',
            });
          }
        }
        setMyAttendanceList(attendances);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    getAttendances();
    console.log('AttendanceList : ', AttendanceList);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      {/*<StatusBar style="auto" />*/}
      {/*<Title title="내 수업✔️" />*/}
      <View>
        <FlatList
          data={MyAttendance}
          renderItem={({item, index}) => (
            <View
              style={{
                borderRadius: 10,
                borderColor: '#b0e0e6',
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
                backgroundColor: '#e0ffff',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    marginLeft: 30,
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  {item.time}
                </Text>
                <Text
                  style={{
                    position: 'absolute',
                    right: 30,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#6a5acd',
                  }}>
                  {item.attend}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={item => String(item.id)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MyAttendance;
