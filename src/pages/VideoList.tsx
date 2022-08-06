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

import {Fonts} from '../assets/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import Title from '../components/Title';
import StudentAttendance from '../pages/StudentAttendance';
import {useWebWiewLogic} from 'react-native-webview/lib/WebViewShared';

function VideoList({navigation}) {
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [loading, setLoading] = useState(false);
  const getAttendances = () => {
    axios(`${Config.API_URL}/attendances/my/now`, {})
      .then(response => {
        console.log(response.data);
        setAttendanceList(response.data);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAttendances();
    console.log('AttendanceList : ', AttendanceList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title="동영상 신청" />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={AttendanceList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('StudentAttendance', item)}>
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
                      수업
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

export default VideoList;
