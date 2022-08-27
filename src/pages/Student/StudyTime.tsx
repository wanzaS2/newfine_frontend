import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type StudyTimeScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudyTime'
>;

function StudyTime({navigation}: StudyTimeScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [StudyList, setStudyList] = useState();
  const [listLength, setLength] = useState();
  let [total, setTotal] = useState();
  const scrollRef = useRef();

  const getMyStudy = () => {
    axios(`${Config.API_URL}/study/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setLength(response.data.length);

        let time = [];
        for (let i = 0; i < response.data.length; i++) {
          // 결석
          if (response.data[i].total < 60) {
            if (response.data[i].endTime == null) {
              time.push({
                id: response.data[i].sstudyId,
                time: `${response.data[i].total} 분`,
                when: response.data[i].startTime.slice(0, 10),
                startTime: response.data[i].startTime.slice(11),
                endTime: '퇴실X',
              });
            } else {
              time.push({
                id: response.data[i].sstudyId,
                time: `${response.data[i].total} 분`,
                when: response.data[i].startTime.slice(0, 10),
                startTime: response.data[i].startTime.slice(11),
                endTime: response.data[i].endTime.slice(11),
              });
            }
          } else {
            const totaltime = response.data[i].total;
            const hour: number = min / 60;
            hour = parseInt(hour.toString());
            const min = totaltime % 60;
            if (response.data[i].endTime == null) {
              time.push({
                id: response.data[i].sstudyId,
                time: `${hour}시간 ${min}분`,
                when: response.data[i].startTime.slice(0, 10),
                startTime: response.data[i].startTime.slice(11),
                endTime: '퇴실X',
              });
            } else {
              time.push({
                id: response.data[i].sstudyId,
                time: `${hour}시간 ${min}분`,
                when: response.data[i].startTime.slice(0, 10),
                startTime: response.data[i].startTime.slice(11),
                endTime: response.data[i].endTime.slice(11),
              });
            }
          }
        }
        setStudyList(time);
      })
      .catch(error => console.error(error));
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
      .catch(error => console.error(error));
  };

  useEffect(() => {
    getMyStudy();
    getMyTotal();
    console.log('AttendanceList : ', StudyList);
    console.log('total', total);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView stickyHeaderIndices={[0]}>
        {/*<StatusBar style="auto" />*/}
        {/*<Title title="내 자습현황️" />*/}
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.time}>
            <Text style={styles.timeFont1}>현재까지 자습시간은</Text>
            <Text style={styles.timeFont2}>
              <Text>총</Text>
              <Text style={{color: '#0077e6'}}> {total} </Text>
              <Text>입니다!</Text>
            </Text>
          </View>
        </View>
        <View>
          <FlatList
            ref={scrollRef}
            data={StudyList}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() =>
                  Alert.alert('자습시간', `${item.startTime} ~ ${item.endTime}`)
                }>
                <View style={styles.box_list}>
                  <Text style={styles.dateText}>{item.when.slice(0, 10)}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={item => String(item.id)}
          />
        </View>
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
        {/*<View style={styles.box_list}>*/}
        {/*  <Text>dmdkr</Text>*/}
        {/*</View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  time: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15%',
    paddingVertical: 20,
    borderRadius: 16,
    borderColor: '#b0e0e6',
    borderWidth: 4,
    marginBottom: 20,
    marginHorizontal: '3%',
    backgroundColor: '#e0f2fe',
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
        elevation: 5,
      },
    }),
  },
  timeFont1: {
    fontSize: 18,
    fontFamily: Fonts.TRRegular,
    color: 'black',
  },
  timeFont2: {
    fontSize: 25,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  box_list: {
    justifyContent: 'center',
    borderColor: '#b0e0e6',
    borderBottomWidth: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  dateText: {
    marginLeft: '5%',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  timeText: {
    position: 'absolute',
    right: '7%',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: '#6a5acd',
  },
});

export default StudyTime;
