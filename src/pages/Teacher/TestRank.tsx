import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';

type TestRankScreenProps = NativeStackScreenProps<TeacherParamList, 'TestRank'>;

function TestRank({route}: TestRankScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [TestList, setTestList] = useState();
  const [highest, sethighest] = useState();
  const [lowest, setlowest] = useState();
  const [avg, setAvg] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [ranklen, setRankLength] = useState();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  console.log('전달받은 것', route.params);
  const getAttendances = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/teacher`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setAvg(response.data.avg);
        sethighest(response.data.highest);
        setlowest(response.data.lowest);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const getRank = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/rank/teacher`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setTestList(response.data);
        setRankLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAttendances();
    getRank();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '10%'}}>
        {/*<ScrollView>*/}
        <View style={styles.myInfo}>
          <View style={styles.scoreBox}>
            <Text style={styles.rank}>평균 </Text>
            <Text style={styles.number}> {avg}점</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.avg}>최고 {highest} 점</Text>
            <Text style={styles.avg}>/ 최저 {lowest} 점</Text>
          </View>
        </View>

        <View style={styles.contentsContainer}>
          <View style={styles.topTitle}>
            <Text style={styles.topFont}>순위</Text>
          </View>
          <View style={styles.listArea}>
            <FlatList
              ref={scrollRef}
              data={TestList}
              renderItem={({item, index}) => (
                <View style={styles.flatList}>
                  <Text style={styles.topRank}>{item.rank}위 </Text>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.score}>{item.score}점</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
        {/*</ScrollView>*/}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentsContainer: {
    // justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: '5%',
    paddingVertical: '5%',
    fontFamily: Fonts.TRBold,
    backgroundColor: '#e0f2fe',
    // backgroundColor: '#fafad2',
  },
  myInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  scoreBox: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rank: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  avg: {
    marginTop: 8,
    paddingLeft: 10,
    // backgroundColor: 'yellow',
    borderRadius: 5,
    fontSize: 18,
    color: 'black',
    fontFamily: Fonts.TRRegular,
  },
  number: {
    color: '#0077e6',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
  },
  topTitle: {
    // marginTop: 8,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3%',
  },
  topFont: {
    fontSize: 30,
    fontFamily: Fonts.TRBold,
    color: '#f97316',
  },
  listArea: {
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    paddingVertical: '5%',
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff7ed',
    marginHorizontal: 25,
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
  topRank: {
    marginLeft: 30,
    position: 'absolute',
    fontFamily: Fonts.TRBold,
    fontSize: 22,
    color: '#f97316',
  },
  nameText: {
    left: 100,
    position: 'absolute',
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  score: {
    position: 'absolute',
    fontSize: 18,
    color: 'black',
    right: 30,
    bottom: -1,
    fontFamily: Fonts.TRRegular,
  },
});

export default TestRank;
