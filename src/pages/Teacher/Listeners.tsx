import React, {useEffect, useState} from 'react';
import {
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
import {Fonts} from '../../assets/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList, TeacherParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import Title from '../../components/Title';
import StudentAttendance from '../Student/StudentAttendance';
import Attendance from '../Attendance';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type ListenersScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'Listeners'
>;

function Listeners({route, navigation}: ListenersScreenProps) {
  const [Students, setStudents] = useState([]);
  const [listLength, setStudentsLength] = useState();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
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
            phone: response.data[i].student.phoneNumber,
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
    console.log('StudentAttendances : ', Students);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title={route.params.cname} />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={Students}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            renderItem={({item, index}) => (
              <View
                style={{
                  borderColor: '#b0e0e6',
                  borderWidth: 1,
                  padding: 5,
                  backgroundColor: '#e0ffff',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 30,
                    fontSize: 20,
                    color: 'black',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    marginLeft: 100,
                    fontSize: 18,
                    color: 'gray',
                    marginRight: 10,
                  }}>
                  {item.phone}
                </Text>
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

export default Listeners;
