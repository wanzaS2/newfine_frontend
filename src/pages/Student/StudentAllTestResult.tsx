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
  Dimensions,
} from 'react-native';

import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import {LineChart} from 'react-native-chart-kit';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type StudentAllTestResultScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentAllTestResult'
>;

const screenWidth = Dimensions.get('window').width;

function StudentAllTestResult({
  route,
  navigation,
}: StudentAllTestResultScreenProps) {
  const [TestList, setTestList] = useState();
  const [MyRank, setMyRank] = useState();
  const [MyScore, setMyScore] = useState();
  const [total, setTotal] = useState();
  const [avg, setAvg] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [qnum, setQnum] = useState([]);
  const [scores, setScores] = useState([]);
  const [new_ranks, setRanks] = useState();
  const [resultlen, setResultLength] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [RData, setRData] = useState({
    labels: qnum,
    datasets: [
      {
        data: [7],
        color: (opacity = 0.6) => '#87cefa',
        strokeWidth: 5, // optional
      },
    ],
    legend: ['내 순위'], // optional
  });
  const [SData, setSData] = useState({
    labels: qnum,
    datasets: [
      {
        data: [39],
        color: (opacity = 0.6) => '#87cefa',
        strokeWidth: 5, // optional
      },
    ],
    legend: ['내 점수'], // optional
  });
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
          // 시험마다 내 점수 , 순위 넣기
          qnum.push(`${response.data[i].test_num}회`); // 회차
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
        RData.labels = qnum;
        SData.labels = qnum;
        RData.datasets[0].data = new_ranks;
        SData.datasets[0].data = scores;
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    console.log('useeffect 살행');
    getAttendances();
    getAllResults();
  }, [listLength]);

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
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{marginTop: '15%'}}>
          <View style={{paddingBottom: '5%'}}>
            {/*          <StatusBar style="auto" />*/}
            <View style={styles.scoreBox}>
              <Text style={styles.rankScore}>순위 </Text>
              <Text style={styles.number}> {MyRank}위</Text>
              <Text style={styles.totalAvg}>/ {total} 명</Text>
            </View>
            <View style={{paddingTop: '3%'}}>
              <LineChart
                data={RData}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                withHorizontalLines={true}
                withOuterLines={true}
                withInnerLines={false}
                withDots={true}
                fromZero={true}
              />
            </View>
          </View>
          <View>
            <View style={styles.scoreBox}>
              <Text style={styles.rankScore}>점수 </Text>
              <Text style={styles.number}> {MyScore}점</Text>
              <Text style={styles.totalAvg}>/ 평균 {avg} 점</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <LineChart
                data={SData}
                width={screenWidth}
                height={300}
                chartConfig={chartConfig}
                fromZero={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rankScore: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  totalAvg: {
    marginTop: 8,
    paddingLeft: 10,
    // backgroundColor: 'yellow',
    borderRadius: 5,
    fontSize: 18,
    color: 'black',
    // fontFamily: Fonts.TRRegular,
  },
  number: {
    color: '#0077e6',
    fontSize: 30,
    fontFamily: Fonts.TRBold,
  },
});

export default StudentAllTestResult;
