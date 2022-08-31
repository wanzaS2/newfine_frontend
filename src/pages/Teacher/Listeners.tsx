import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TeacherParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import Title from '../../components/Title';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Fonts} from '../../assets/Fonts';
import {Divider} from 'native-base';

type ListenersScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'Listeners'
>;

function Listeners({route}: ListenersScreenProps) {
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
  console.log(route.params);
  const getListeners = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios(`${Config.API_URL}/listeners`, {
      params: {id: route.params.id},
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
          attendances.push({
            id: response.data[i].id,
            name: response.data[i].student.name,
            phone1: response.data[i].student.phoneNumber.substring(0, 3),
            phone2: response.data[i].student.phoneNumber.substring(3, 7),
            phone3: response.data[i].student.phoneNumber.substring(7, 12),
          });
        }
        setStudents(attendances);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };
  console.log(route.params);
  useEffect(() => {
    getListeners();
    console.log('학생: ', Students);
    console.log('StudentAttendances : ', Students);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseArea}>
        <Text style={styles.courseName}>#{route.params.cname}</Text>
        <Text style={{fontSize: 23, fontFamily: Fonts.TRBold, color: 'black'}}>
          {'  '}
          수강생 리스트
        </Text>
      </View>
      <Divider
        my="0"
        _light={{
          bg: 'teal.500',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      {/*<View style={{borderColor: '#b0e0e6', borderBottomWidth: 1}} />*/}
      <View>
        <FlatList
          ref={scrollRef}
          data={Students}
          onRefresh={fetchItems} // fetch로 데이터 호출
          refreshing={isRefreshing} // state
          renderItem={({item, index}) => (
            <View style={styles.box_list}>
              <Text style={styles.studentText}>
                {index + 1}){'   '}
                {item.name}
              </Text>
              <Divider
                bg="indigo.200"
                thickness="2"
                mx="2"
                orientation="vertical"
                style={{
                  position: 'absolute',
                  right: '48%',
                  bottom: '65%',
                }}
              />
              <Text style={styles.phoneNumberText}>
                {item.phone1}-{item.phone2}-{item.phone3}
              </Text>
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
  courseArea: {
    marginTop: '3.3%',
    marginLeft: '12%',
    paddingBottom: '3%',
    flexDirection: 'row',
  },
  courseName: {
    fontSize: 23,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
  },
  box_list: {
    // justifyContent: 'center',
    borderColor: '#2dd4bf',
    borderBottomWidth: 1,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  studentText: {
    marginLeft: '5%',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  phoneNumberText: {
    position: 'absolute',
    right: '8%',
    bottom: '65%',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: '#4f46e5',
  },
});

export default Listeners;
