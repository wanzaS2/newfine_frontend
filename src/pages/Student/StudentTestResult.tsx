import React, {useEffect, useState} from 'react';
import {
  Alert,
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
import Title from '../../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';

function StudentTestResult({route, navigation}) {
  const [TestList, setTestList] = useState();
  const [MyRank, setMyRank] = useState();
  const [MyScore, setMyScore] = useState();
  const [total, setTotal] = useState();
  const [avg, setAvg] = useState();
  const [top5, settop5] = useState();
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
        setAvg(response.data.avg);
        setMyRank(response.data.rank);
        setMyScore(response.data.myScore);
        setTotal(response.data.total);
        console.log('처음 top5', top5);
        setmycorrect(response.data.notCorrectDtos);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const setmycorrect = top5 => {
    let correct = [];
    console.log('top5', top5);
    for (let i = 0; i < 5; i++) {
      if (top5[i].isCorrect == false) {
        // 내가 이 문제를 틀렸다면
        correct.push({
          id: i + 1,
          rank: top5[i].q_rank,
          q_num: top5[i].q_num,
          rate: top5[i].rate,
          my_ans: `내 답:${top5[i].student_ans}/`,
          ans: `답:${top5[i].right_ans}`,
          correct: 'X',
        });
      } else {
        correct.push({
          id: i,
          rank: top5[i].q_rank,
          q_num: top5[i].q_num,
          rate: top5[i].rate,
          my_ans: '',
          ans: '맞았습니다!',
          correct: 'O',
        });
      }
    }
    settop5(correct);
    console.log(top5);
  };

  useEffect(() => {
    getAttendances();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <View style={styles.myinfo}>
          <View style={styles.scorebox}>
            <Text style={styles.rank}>순위 </Text>
            <Text style={styles.number}> {MyRank}위</Text>
            <Text style={styles.total}>/ {total} 명</Text>
          </View>
          <View style={styles.scorebox}>
            <Text style={styles.score}>점수 </Text>
            <Text style={styles.number}> {MyScore}점</Text>
            <Text style={styles.avg}>/ 평균 {avg} 점</Text>
          </View>
        </View>
        <View style={styles.topfive}>
          <View style={styles.toptitle}>
            <Text style={styles.topfont}>오답률 Best 5</Text>
          </View>
          <FlatList
            data={top5}
            renderItem={({item, index}) => (
              <View style={styles.box_list}>
                <View style={styles.box}>
                  <Text style={styles.toprank}>{item.rank}위 </Text>
                  <Text
                    style={{
                      marginLeft: 60,
                      position: 'absolute',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: Fonts.TRBold,
                      color: '#87cefa',
                    }}>
                    {item.q_num}번
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      marginLeft: 110,
                      position: 'absolute',
                      fontSize: 16,
                    }}>
                    ({item.rate}%)
                  </Text>
                  <Text style={styles.correct}>{item.correct}</Text>
                  <Text
                    style={{
                      marginLeft: 200,
                      position: 'absolute',
                      fontSize: 16,
                    }}>
                    {item.my_ans} {item.ans}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    fontFamily: Fonts.TRBold,
  },
  myinfo: {
    weight: 60,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  box_list: {
    borderRadius: 15,
    borderColor: '#87cefa',
    borderWidth: 2,
    padding: 7,
    justifyContent: 'flex-start',
    marginTop: 5,
    backgroundColor: '#fff8dc',
  },
  box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  rank: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
  },
  scorebox: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
  },
  avg: {
    marginTop: 8,
    paddingLeft: 10,
    // backgroundColor: 'yellow',
    borderRadius: 5,
    fontSize: 18,
  },
  total: {
    marginTop: 8,
    paddingLeft: 10,
    // backgroundColor: 'yellow',
    borderRadius: 5,
    fontSize: 18,
  },
  number: {
    color: '#87cefa',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
  },
  topfive: {
    height: 360,
    justifyContent: 'flex-start',
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'lightskyblue',
    borderWidth: 8,
    marginBottom: 20,
    fontFamily: Fonts.TRBold,
    backgroundColor: '#f0f8ff',
    // backgroundColor: '#fafad2',
  },
  toptitle: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: Fonts.TRRegular,
    marginBottom: 4,
  },
  topfont: {
    fontSize: 28,
    fontFamily: Fonts.TRBold,
    fontWeight: 'bold',
    color: '#87cefa',
  },
  toprank: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: '900',
    color: '#87cefa',
  },
  correct: {
    marginLeft: 180,
    position: 'absolute',
    fontSize: 20,
    color: '#ffa07a',
    fontWeight: 'bold',
  },
});

export default StudentTestResult;
