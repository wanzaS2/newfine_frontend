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
import StudentAttendance from '../pages/StudentAttendance';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {Fonts} from '../assets/Fonts';

function StudyTime({route, navigation}) {
  const [StudyList, setStuyList] = useState();
  const [listLength, setLength] = useState();
  let [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const getMyStudy = () => {
    axios(`${Config.API_URL}/study/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setLength(response.data.length);
        console.log('내 토큰');
        console.log(accessToken);
        let time = [];
        for (let i = 0; i < response.data.length; i++) {
          // 결석
          if (response.data[i].total < 60) {
            time.push({
              id: response.data[i].sstudyId,
              time: `${response.data[i].total} 분`,
              when: response.data[i].startTime.slice(0, 10),
            });
          } else {
            const totaltime = response.data[i].total;
            const hour: number = min / 60;
            hour = parseInt(hour.toString());
            const min = totaltime % 60;
            time.push({
              id: response.data[i].sstudyId,
              time: `${hour}시간 ${min}분`,
              when: response.data[i].startTime.slice(0, 10),
            });
          }
        }
        setStuyList(time);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const getMyTotal = () => {
    axios(`${Config.API_URL}/study/total`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log('결과');
        console.log(response.data);
        let time;
        if (response.data < 60) {
          time = `${response.data} 분`;
        } else {
          const totaltime = response.data;
          const hour: number = min / 60;
          hour = parseInt(hour.toString());

          const min = totaltime % 60;
          time = `${hour}시간 ${min}분`;
        }
        setTotal(time);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getMyStudy();
    getMyTotal();
    console.log('AttendanceList : ', StudyList);
    console.log('total', total);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title="내 자습현황️" />
      <SafeAreaView style={styles.container}>
        <View style={styles.time}>
          <Text style={styles.timefont1}>현재까지 자습시간은</Text>
          <Text style={styles.timefont2}>총 {total} 입니다!</Text>
        </View>
        <View>
          <FlatList
            data={StudyList}
            renderItem={({item, index}) => (
              <View style={styles.box_list}>
                <View style={styles.box}>
                  <Text
                    style={{
                      marginLeft: 30,
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    {item.when.slice(0, 10)}
                  </Text>
                  <Text
                    style={{
                      position: 'absolute',
                      right: 30,
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#6a5acd',
                    }}>
                    {item.time}
                  </Text>
                </View>
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
  time: {
    weight: 60,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderRadius: 8,
    borderColor: '#b0e0e6',
    borderWidth: 4,
    marginBottom: 20,
    // backgroundColor: '#fafad2',
  },
  box_list: {
    borderRadius: 4,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#e0ffff',
  },
  box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  timefont1: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 20,
    fontFamily: Fonts.TRRegular,
  },
  timefont2: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 25,
    fontFamily: Fonts.TRBold,
  },
});

export default StudyTime;
