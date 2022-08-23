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
  ScrollView,
  Button,
} from 'react-native';

import axios from 'axios';
import Config from 'react-native-config';
import Title from '../../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import Icon from 'react-native-vector-icons/AntDesign';

function TeacherTest({route, navigation}) {
  const [TestList, setTestList] = useState();
  const [highest, sethighest] = useState();
  const [lowest, setlowest] = useState();
  const [avg, setAvg] = useState();
  const [top5, settop5] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [Bkiller, setBkiller] = useState();
  const [killer, setKiller] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
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
        setTestList(response.data);
        setAvg(response.data.avg);
        sethighest(response.data.highest);
        setlowest(response.data.lowest);
        setmycorrect(response.data.notCorrectDtos);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const getTypeResult = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/type/teacher`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log('type 결과', response.data);
        let bk = response.data.bkillerDtos;
        console.log('킬러', bk);
        let bkiller = [];
        for (let i = 0; i < bk.length; i++) {
          let best1 = bk[i].most_chosen.slice(0, 1);
          let best2 = bk[i].most_chosen.slice(1, 2);
          let best3 = bk[i].most_chosen.slice(2, 3);
          let best4 = bk[i].most_chosen.slice(3, 4);
          let best5 = bk[i].most_chosen.slice(4);

          bkiller.push({
            id: i + 1,
            q_num: bk[i].q_num,
            rate: bk[i].rate,
            right_ans: bk[i].right_ans,
            mostchosen: `학생들은 ${best1}, ${best2}, ${best3} ,${best4}, ${best5}순으로 많이 선택했어요.`,
          });
        }
        setBkiller(bkiller);
        let k = response.data.killerDtos;
        console.log('k', k);
        let killer = [];
        for (let i = 0; i < k.length; i++) {
          let best1 = k[i].most_chosen.slice(0, 1);
          let best2 = k[i].most_chosen.slice(1, 2);
          let best3 = k[i].most_chosen.slice(2, 3);
          let best4 = k[i].most_chosen.slice(3, 4);
          let best5 = k[i].most_chosen.slice(4);

          killer.push({
            id: i + 1,
            q_num: k[i].q_num,
            rate: k[i].rate,
            right_ans: k[i].right_ans,
            mostchosen: `학생들은 ${best1}, ${best2}, ${best3} ,${best4}, ${best5} 순으로 많이 선택했어요.`,
          });
        }
        console.log('killer', killer);
        setKiller(killer);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const setmycorrect = top5 => {
    let correct = [];
    console.log('top5', top5);
    for (let i = 0; i < 5; i++) {
      // 내가 이 문제를 틀렸다면
      correct.push({
        id: i + 1,
        rank: top5[i].q_rank,
        q_num: top5[i].q_num,
        rate: top5[i].rate,
        ans: `답:${top5[i].right_ans}`,
      });
    }
    settop5(correct);
    console.log(top5);
  };

  useEffect(() => {
    getAttendances();
    getTypeResult();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <View style={styles.myinfo}>
            <View style={styles.scorebox}>
              <Text style={styles.rank}>평균 </Text>
              <Text style={styles.number}> {avg}점</Text>
            </View>
            <View style={styles.scorebox}>
              <Text style={styles.avg}>최고 {highest} 점</Text>
              <Text style={styles.avg}>/ 최저 {lowest} 점</Text>
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
                        marginLeft: 90,
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
                        marginLeft: 140,
                        position: 'absolute',
                        fontSize: 16,
                      }}>
                      ({item.rate}%)
                    </Text>
                    <Text style={styles.correct}>{item.correct}</Text>
                    <Text
                      style={{
                        marginLeft: 250,
                        position: 'absolute',
                        fontSize: 16,
                      }}>
                      {item.ans}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.killerzone}>
            <View style={styles.toptitle}>
              <Text style={styles.topfont}>킬러문항 분석</Text>
            </View>
            <FlatList
              data={Bkiller}
              renderItem={({item, index}) => (
                <View style={styles.killerbox_list}>
                  <View style={styles.killerbox_title}>
                    <Text style={styles.killernum}>{item.q_num}번 </Text>
                    <Text
                      style={{
                        marginLeft: 70,
                        position: 'absolute',
                        fontSize: 18,
                        fontFamily: Fonts.TRBold,
                        color: '#87cefa',
                      }}>
                      정답:{item.right_ans}번 |
                    </Text>
                    <Text
                      style={{
                        marginLeft: 160,
                        position: 'absolute',
                        fontSize: 18,
                        fontFamily: Fonts.TRBold,
                        color: '#87cefa',
                      }}>
                      오답률 ({item.rate}%)
                    </Text>
                  </View>

                  <View style={styles.killerbox_content}>
                    <Text
                      style={{
                        padding: 3,
                        position: 'absolute',
                        fontSize: 16,
                        color: '#ffa07a',
                        fontWeight: 'bold',
                        marginLeft: 10,
                        fontFamily: Fonts.TRBold,
                      }}>
                      {item.mostchosen}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.killerzone}>
            <View style={styles.toptitle}>
              <Text style={styles.topfont}>준킬러문항 분석</Text>
            </View>
            <FlatList
              data={killer}
              renderItem={({item, index}) => (
                <View style={styles.killerbox_list}>
                  <View style={styles.killerbox_title}>
                    <Text style={styles.killernum}>{item.q_num}번 </Text>
                    <Text
                      style={{
                        marginLeft: 70,
                        position: 'absolute',
                        fontSize: 18,
                        fontFamily: Fonts.TRBold,
                        color: '#87cefa',
                      }}>
                      정답:{item.right_ans}번 |
                    </Text>
                    <Text
                      style={{
                        marginLeft: 160,
                        position: 'absolute',
                        fontSize: 18,
                        fontFamily: Fonts.TRBold,
                        color: '#87cefa',
                      }}>
                      오답률 ({item.rate}%)
                    </Text>
                  </View>
                  <View style={styles.killerbox_content}>
                    <Text
                      style={{
                        padding: 3,
                        position: 'absolute',
                        fontSize: 17,
                        color: '#ffa07a',
                        fontWeight: 'bold',
                        marginLeft: 10,
                        fontFamily: Fonts.TRRegular,
                      }}>
                      {item.mostchosen}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TestRank', route.params)}>
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 20,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: Fonts.TRBold,
                }}>
                학생 순위 보러가기
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#87cefa',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 100,
    width: 320,
    height: 60,
  },
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
  killerbox_list: {
    borderRadius: 15,
    borderColor: '#87cefa',
    borderWidth: 2,
    padding: 7,
    justifyContent: 'flex-start',
    marginTop: 10,
    backgroundColor: '#fff8dc',
    height: 100,
  },
  box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  killerbox_title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  killerbox_content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 25,
    fontFamily: Fonts.TRBold,
    backgroundColor: '#f0f8ff',
    // backgroundColor: '#fafad2',
  },
  killerzone: {
    height: 300,
    justifyContent: 'flex-start',
    marginTop: 10,
    // borderRadius: 10,
    // borderColor: 'lightskyblue',
    // borderWidth: 8,
    marginBottom: 15,
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
  killernum: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: '900',
    color: '#ffa07a',
    fontFamily: Fonts.TRBold,
  },
  correct: {
    marginLeft: 180,
    position: 'absolute',
    fontSize: 20,
    color: '#ffa07a',
    fontWeight: 'bold',
  },
  killercorrect: {
    padding: 3,
    position: 'absolute',
    fontSize: 16,
    color: '#87cefa',
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: Fonts.TRBold,
  },
});

export default TeacherTest;
