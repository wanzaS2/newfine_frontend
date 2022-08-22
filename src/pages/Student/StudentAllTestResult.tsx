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
  Dimensions,
} from 'react-native';

import axios from 'axios';
import Config from 'react-native-config';
import Title from '../../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import Icon from 'react-native-vector-icons/AntDesign';
import {LineChart} from 'react-native-chart-kit';

function StudentAllTestResult({route, navigation}) {
  const [TestList, setTestList] = useState();
  const [MyRank, setMyRank] = useState();
  const [MyScore, setMyScore] = useState();
  const [total, setTotal] = useState();
  const [avg, setAvg] = useState();
  const [top5, settop5] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [qnum, setQnum] = useState();
  const [scores, setScores] = useState();
  const [rdata, setRData] = useState();
  const [sdata, setSData] = useState();
  const [new_ranks, setRanks] = useState();
  const [resultlen, setResultLength] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const screenWidth = Dimensions.get('window').width;
  const getAllResults = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/all/my`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log('전체결과', response.data);
        console.log(response.data.length);
        let qnum = [];
        let scores = [];
        let new_ranks = [];
        for (let i = 0; i < response.data.length; i++) {
          // 내가 이 문제를 틀렸다면
          qnum.push(`${response.data[i].test_num}회`);
          scores.push(response.data[i].score);
          new_ranks.push(response.data[i].rank);
        }

        setQnum(qnum);
        setRanks(new_ranks);
        setScores(scores);
        setResultLength(response.data.length);
        console.log('qnum', qnum);
        console.log('scores', scores);
        console.log('ranks', new_ranks);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getAttendances();
    getAllResults();
  }, [listLength]);
  const chartConfig = {
    backgroundGradientFrom: '#f0f8ff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#f0f8ff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 0.6) => '#87cefa',
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    decimalPlaces: 0, // 정수로 바꾸는 부분
  };
  const r_val = () => console.log('rank', new_ranks);
  // rank.forEach(item => {
  //   return item;
  // });

  const rank_data = {
    labels: qnum,
    datasets: [
      {
        data: [8],
        color: (opacity = 0.6) => '#87cefa',
        strokeWidth: 5, // optional
      },
    ],
    legend: ['내 순위'], // optional
  };
  const score_data = {
    labels: qnum,
    datasets: [
      {
        data: [39],
        color: (opacity = 0.6) => '#87cefa',
        strokeWidth: 5, // optional
      },
    ],
    legend: ['내 점수'], // optional
  };

  const getAttendances = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/my`, {
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
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <View style={styles.myinfo}>
            <View style={styles.scorebox}>
              <Text style={styles.rank}>순위 </Text>
              <Text style={styles.number}> {MyRank}위</Text>
              <Text style={styles.total}>/ {total} 명</Text>
            </View>
          </View>
          <LineChart
            data={rank_data}
            width={screenWidth}
            height={300}
            chartConfig={chartConfig}
            withHorizontalLines={true}
            withOuterLines={true}
            withInnerLines={false}
            withDots={true}
            fromZero={true}
          />
          <View style={styles.myinfo}>
            <View style={styles.scorebox}>
              <Text style={styles.score}>점수 </Text>
              <Text style={styles.number}> {MyScore}점</Text>
              <Text style={styles.avg}>/ 평균 {avg} 점</Text>
            </View>
          </View>
          <LineChart
            data={score_data}
            width={screenWidth}
            height={300}
            chartConfig={chartConfig}
            fromZero={true}
          />
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
    flex: 3,
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
    height: 120,
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
    marginTop: 26,
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
  killerzone: {
    height: 310,
    justifyContent: 'flex-start',
    marginTop: 10,
    // borderRadius: 10,
    // borderColor: 'lightskyblue',
    // borderWidth: 8,
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

export default StudentAllTestResult;
