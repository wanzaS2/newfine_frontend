import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';

type StudentAttendanceScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'StudentAttendance'
>;

function StudentAttendance({route}: StudentAttendanceScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [Students, setStudents] = useState([]);
  const [listLength, setStudentsLength] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef();

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
        {text: '동영상', onPress: () => edit_attendance(item, '동영상')},
      ],
    );
  };
  const edit_attendance = (id, state) => {
    console.log(id, state);
    axios
      .put(
        `${Config.API_URL}/teacher/attendance`,
        {
          id: id,
          state: state,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
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
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '15%'}}>
        <View style={{borderColor: '#fde68a', borderBottomWidth: 3}} />
        <View>
          <FlatList
            ref={scrollRef}
            data={Students}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            renderItem={({item, index}) => (
              <View style={styles.box_list}>
                <Text style={styles.nameText}>{item.name}</Text>
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
                <TouchableOpacity
                  onPress={() => showAlert(item.id)}
                  style={styles.icon}>
                  <Icon name="edit" size={25} color="black" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => String(item.id)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  box_list: {
    // justifyContent: 'center',
    borderColor: '#fde68a',
    borderBottomWidth: 1,
    padding: 15,
    backgroundColor: '#fffbeb',
    flexDirection: 'row',
  },
  nameText: {
    marginLeft: '5%',
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  attendanceText: {
    position: 'absolute',
    right: 70,
    bottom: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
  },
  absenceText: {
    position: 'absolute',
    right: 70,
    bottom: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#ef4444',
  },
  tardyText: {
    position: 'absolute',
    right: 70,
    bottom: 15,
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: '#16a34a',
  },
  icon: {
    position: 'absolute',
    right: 17,
    bottom: 15,
  },
});

export default StudentAttendance;
