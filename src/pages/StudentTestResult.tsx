import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';
import Config from 'react-native-config';
import Title from '../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

function StudentTestResult({route, navigation}) {
  const [TestList, setTestList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  console.log(route.params.id);
  const getAttendances = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setTestList(response.data);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAttendances();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title={route.params.cname} />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={TestList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('StudentAttendance')}>
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
                      {item.startTime.slice(0, 10)}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        right: 30,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {item.course.start_time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => String(item.attendanceId)}
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

export default StudentTestResult;
