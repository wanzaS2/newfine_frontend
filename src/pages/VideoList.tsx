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
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

function VideoList({navigation}) {
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const getAttendances = () => {
    axios(`${Config.API_URL}/attendances/my/now`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
    console.log('동영상 가능 리스트 : ', AttendanceList);
    console.log('동영상 갯수 : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <View style={styles.subtitlebox}>
          <Text style={styles.subtitle}>
            현재 동영상 신청을 할 수 있는 수업입니다!
          </Text>
        </View>
        <View>
          <FlatList
            data={AttendanceList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('VideoAuth', item)}>
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
                      {item.course.cname}
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
  subtitle: {
    fontSize: 18,
    color: '#6495ed',
    fontWeight: 'bold',
  },
  subtitlebox: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    marginTop: 30,
  },
});

export default VideoList;
