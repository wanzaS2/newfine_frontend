import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Calendar} from 'react-native-calendars/src';
import {Pressable} from 'native-base';
import {Fonts} from '../../assets/Fonts';
import DismissKeyboardView from '../../components/DismissKeyboardView';

type MyAttendanceScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'MyAttendance'
>;

function MyAttendance({route, navigation}: MyAttendanceScreenProps) {
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
      <ScrollView>
        {/*<StatusBar style="auto" />*/}
        {/*<Title title="내 수업✔️" />*/}
        <View style={styles.listArea}>
          <FlatList
            data={MyAttendance}
            renderItem={({item, index}) => (
              <View style={styles.flatList}>
                <Text style={styles.dateText}>{item.time}</Text>
                <Text
                  style={
                    item.attend === '출석'
                      ? styles.attendanceText
                      : item.attend === '결석'
                      ? styles.absenceText
                      : styles.tardyText
                  }>
                  {item.attend}
                </Text>
              </View>
            )}
            keyExtractor={item => String(item.id)}
          />
        </View>
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.flatList}>*/}
        {/*  <Text style={styles.dateText}>dmdkr</Text>*/}
        {/*</View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  listArea: {
    marginTop: '15%',
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    paddingVertical: 15,
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dateText: {
    marginLeft: '5%',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  attendanceText: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
  },
  absenceText: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#ef4444',
  },
  tardyText: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#16a34a',
  },
});

export default MyAttendance;
