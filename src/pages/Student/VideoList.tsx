import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LoggedInParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Fonts} from '../../assets/Fonts';

type VideoListScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'VideoList'
>;

function VideoList({navigation}: VideoListScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [loading, setLoading] = useState(false);

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
    console.log('동영상  개수: ', listLength);
  }, [listLength]);

  const isVideo = () => {
    console.log(listLength);
    if (listLength === undefined) {
      return (
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitleX}>
            현재 동영상 신청을 할 수 있는 수업이 없습니다.
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitle}>
            현재 동영상 신청을 할 수 있는 수업입니다!
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isVideo()}
      <View>
        <FlatList
          data={AttendanceList}
          renderItem={({item, index}) => (
            <Pressable onPress={() => navigation.navigate('VideoAuth', item)}>
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
            </Pressable>
          )}
          keyExtractor={item => String(item.attendanceId)}
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
  subtitleBox: {
    // backgroundColor: 'pink',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: '15%',
  },
  subtitleX: {
    fontSize: 17,
    color: '#ef4444',
    fontFamily: Fonts.TRBold,
  },
  subtitle: {
    fontSize: 17,
    color: '#0077e6',
    fontFamily: Fonts.TRBold,
  },
});

export default VideoList;
