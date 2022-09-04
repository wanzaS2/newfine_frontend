import React, {useEffect, useState} from 'react';
import {
  // FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  // ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import Carousel from '../../components/Carousel';
import MyPage from './MyPage';
import {useNavigation} from '@react-navigation/native';
import Attendance from '../Attendance';
import AttendanceInfo from './AttendanceInfo';
import AllRanking from './AllRanking';
import RankingPoint from './MyPointList';

type StudentTestResultScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentTestResult'
>;

const CarouselPage = ({
  item,
}: {
  item: {
    id: number;
    color: string;
  };
}) => {
  if (item.id === 0) {
    return (
      <View>
        <View
          style={{
            width: screenWidth - 20,
            height: '100%',
            backgroundColor: item.color,
          }}
        />
        {/*<CarouselPage1 />*/}
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: screenWidth - 20,
          height: '100%',
          backgroundColor: item.color,
        }}
      />
    );
  }
};

const Sheet = [
  {id: 0, color: '#e0f2fe'},
  {id: 1, color: '#e0f2fe'},
  {id: 2, color: '#e0f2fe'},
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function StudentTestResult({route, navigation}: StudentTestResultScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [TestList, setTestList] = useState();
  const [MyRank, setMyRank] = useState();
  const [MyScore, setMyScore] = useState();
  const [total, setTotal] = useState();
  const [avg, setAvg] = useState();
  const [top5, settop5] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [Bkiller, setBkiller] = useState();
  const [killer, setKiller] = useState();
  const [page, setPage] = useState(0);

  console.log('전달받은 것', route.params);
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
        setmycorrect(response.data.notCorrectDtos);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error));
  };
  const getTypeResult = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/type`, {
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
          let best3 = bk[i].most_chosen.slice(2);
          if (bk[i].iscorrect == false) {
            // 내가 틀렸다면
            bkiller.push({
              id: i + 1,
              q_num: bk[i].q_num,
              rate: bk[i].rate,
              right_ans: bk[i].right_ans,
              iscorrect: `나는 ${bk[i].student_ans}를 선택하여 틀렸어요.`,
              mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
            });
          } else {
            bkiller.push({
              id: i + 1,
              q_num: bk[i].q_num,
              rate: bk[i].rate,
              right_ans: bk[i].right_ans,
              iscorrect: '나는 맞았어요!',
              mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
            });
          }
          setBkiller(bkiller);
          let k = response.data.killerDtos;
          console.log('k', k);
          let killer = [];
          for (let i = 0; i < k.length; i++) {
            let best1 = k[i].most_chosen.slice(0, 1);
            let best2 = k[i].most_chosen.slice(1, 2);
            let best3 = k[i].most_chosen.slice(2);
            if (bk[i].iscorrect == false) {
              // 내가 틀렸다면
              killer.push({
                id: i + 1,
                q_num: k[i].q_num,
                rate: k[i].rate,
                right_ans: k[i].right_ans,
                iscorrect: `나는 ${k[i].student_ans}를 선택하여 틀렸어요.`,
                mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
              });
            } else {
              killer.push({
                id: i + 1,
                q_num: k[i].q_num,
                rate: k[i].rate,
                right_ans: k[i].right_ans,
                iscorrect: '나는 맞았어요!',
                mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
              });
            }
          }
          console.log('killer', killer);
          setKiller(killer);
        }
      })
      .catch(error => console.error(error));
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
    getTypeResult();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      {/*<ScrollView>*/}
      {/*<StatusBar style="auto" />*/}
      <View style={{marginTop: '10%'}}>
        <View style={styles.myInfo}>
          <View style={styles.scoreBox}>
            <Text style={styles.rankScore}>순위 </Text>
            <Text style={styles.number}> {MyRank}위</Text>
            <Text style={styles.totalAvg}>/ {total} 명</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.rankScore}>점수 </Text>
            <Text style={styles.number}> {MyScore}점</Text>
            <Text style={styles.totalAvg}>/ 평균 {avg} 점</Text>
          </View>
        </View>
        <Carousel
          page={page}
          setPage={setPage}
          gap={16}
          data={Sheet}
          pageWidth={screenWidth - 20}
          RenderItem={CarouselPage}
        />

        {/*<View style={styles.contentsContainer}>*/}
        {/*  <View style={styles.topTitle}>*/}
        {/*    <Text style={styles.topFont}>오답률 Top 5</Text>*/}
        {/*  </View>*/}
        {/*  <FlatList*/}
        {/*    data={top5}*/}
        {/*    renderItem={({item, index}) => (*/}
        {/*      <View style={styles.contentList}>*/}
        {/*        <Text style={styles.topRank}>{item.rank}위 </Text>*/}
        {/*        <Text style={styles.probNum}>{item.q_num}번</Text>*/}
        {/*        <Text*/}
        {/*          style={{*/}
        {/*            marginTop: 4,*/}
        {/*            marginLeft: 110,*/}
        {/*            position: 'absolute',*/}
        {/*            fontSize: 16,*/}
        {/*            color: 'black',*/}
        {/*          }}>*/}
        {/*          ({item.rate}%)*/}
        {/*        </Text>*/}
        {/*        <Text*/}
        {/*          style={*/}
        {/*            item.correct === 'O'*/}
        {/*              ? StyleSheet.compose(styles.wrong, styles.correct)*/}
        {/*              : styles.wrong*/}
        {/*          }>*/}
        {/*          {item.correct}*/}
        {/*        </Text>*/}
        {/*        <Text*/}
        {/*          style={{*/}
        {/*            marginLeft: 230,*/}
        {/*            position: 'absolute',*/}
        {/*            fontSize: 16,*/}
        {/*            color: 'black',*/}
        {/*          }}>*/}
        {/*          {item.my_ans} {item.ans}*/}
        {/*        </Text>*/}
        {/*      </View>*/}
        {/*    )}*/}
        {/*    keyExtractor={(item, index) => index.toString()}*/}
        {/*  />*/}
        {/*</View>*/}
        {/*<View style={styles.contentsContainer}>*/}
        {/*  <View style={styles.topTitle}>*/}
        {/*    <Text style={styles.topFont}>킬러문항 분석</Text>*/}
        {/*  </View>*/}
        {/*  <FlatList*/}
        {/*    data={Bkiller}*/}
        {/*    renderItem={({item, index}) => (*/}
        {/*      <View style={styles.killerBox_list}>*/}
        {/*        <View style={styles.killerBox_title}>*/}
        {/*          <Text style={styles.topRank}> 문제 {item.q_num}번 </Text>*/}
        {/*          <Text style={styles.wrongRate}>*/}
        {/*            정답: {item.right_ans}번 | 오답률 ({item.rate}%)*/}
        {/*          </Text>*/}
        {/*        </View>*/}
        {/*        <View style={styles.killerBox_content}>*/}
        {/*          <Text style={styles.killerExplain}>*/}
        {/*            {item.iscorrect}*/}
        {/*            {'\n'}*/}
        {/*            {item.mostchosen}*/}
        {/*          </Text>*/}
        {/*        </View>*/}
        {/*      </View>*/}
        {/*    )}*/}
        {/*    keyExtractor={(item, index) => index.toString()}*/}
        {/*  />*/}
        {/*</View>*/}
        {/*<View style={styles.contentsContainer}>*/}
        {/*  <View style={styles.topTitle}>*/}
        {/*    <Text style={styles.topFont}>준킬러문항 분석</Text>*/}
        {/*  </View>*/}
        {/*  <FlatList*/}
        {/*    data={killer}*/}
        {/*    renderItem={({item, index}) => (*/}
        {/*      <View style={styles.killerBox_list}>*/}
        {/*        <View style={styles.killerBox_title}>*/}
        {/*          <Text style={styles.topRank}> 문제 {item.q_num}번 </Text>*/}
        {/*          <Text style={styles.wrongRate}>*/}
        {/*            정답: {item.right_ans}번 | 오답률 ({item.rate}%)*/}
        {/*          </Text>*/}
        {/*        </View>*/}
        {/*        <View style={styles.killerBox_content}>*/}
        {/*          <Text style={styles.killerExplain}>*/}
        {/*            {item.iscorrect}*/}
        {/*            {'\n'}*/}
        {/*            {item.mostchosen}*/}
        {/*          </Text>*/}
        {/*        </View>*/}
        {/*      </View>*/}
        {/*    )}*/}
        {/*    keyExtractor={(item, index) => index.toString()}*/}
        {/*  />*/}
        {/*</View>*/}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 30,
            // backgroundColor: 'pink',
          }}>
          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate('StudentAllTestResult', route.params)
            }>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                fontFamily: Fonts.TRBold,
              }}>
              전회차 분석 보러가기
            </Text>
          </Pressable>
        </View>
      </View>
      {/*</ScrollView>*/}
    </SafeAreaView>
  );
}

// const CarouselPage1 = ({route}: StudentTestResultScreenProps) => {
//   const accessToken = useSelector((state: RootState) => state.user.accessToken);
//   const [TestList, setTestList] = useState();
//   const [MyRank, setMyRank] = useState();
//   const [MyScore, setMyScore] = useState();
//   const [total, setTotal] = useState();
//   const [avg, setAvg] = useState();
//   const [top5, settop5] = useState();
//   const [listLength, setAttendanceLength] = useState();
//   const [Bkiller, setBkiller] = useState();
//   const [killer, setKiller] = useState();
//   const [page, setPage] = useState(0);
//
//   console.log('전달받은 것', route.params);
//   const getAttendances = () => {
//     console.log(route.params);
//     axios(`${Config.API_URL}/test/result/my`, {
//       params: {id: route.params},
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then(response => {
//         console.log(response.data);
//         setTestList(response.data);
//         setAvg(response.data.avg);
//         setMyRank(response.data.rank);
//         setMyScore(response.data.myScore);
//         setTotal(response.data.total);
//         console.log('처음 top5', top5);
//         setmycorrect(response.data.notCorrectDtos);
//         setAttendanceLength(response.data.length);
//       })
//       .catch(error => console.error(error));
//   };
//   const getTypeResult = () => {
//     console.log(route.params);
//     axios(`${Config.API_URL}/test/result/type`, {
//       params: {id: route.params},
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then(response => {
//         console.log('type 결과', response.data);
//         let bk = response.data.bkillerDtos;
//         console.log('킬러', bk);
//         let bkiller = [];
//         for (let i = 0; i < bk.length; i++) {
//           let best1 = bk[i].most_chosen.slice(0, 1);
//           let best2 = bk[i].most_chosen.slice(1, 2);
//           let best3 = bk[i].most_chosen.slice(2);
//           if (bk[i].iscorrect == false) {
//             // 내가 틀렸다면
//             bkiller.push({
//               id: i + 1,
//               q_num: bk[i].q_num,
//               rate: bk[i].rate,
//               right_ans: bk[i].right_ans,
//               iscorrect: `나는 ${bk[i].student_ans}를 선택하여 틀렸어요.`,
//               mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
//             });
//           } else {
//             bkiller.push({
//               id: i + 1,
//               q_num: bk[i].q_num,
//               rate: bk[i].rate,
//               right_ans: bk[i].right_ans,
//               iscorrect: '나는 맞았어요!',
//               mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
//             });
//           }
//           setBkiller(bkiller);
//           let k = response.data.killerDtos;
//           console.log('k', k);
//           let killer = [];
//           for (let i = 0; i < k.length; i++) {
//             let best1 = k[i].most_chosen.slice(0, 1);
//             let best2 = k[i].most_chosen.slice(1, 2);
//             let best3 = k[i].most_chosen.slice(2);
//             if (bk[i].iscorrect == false) {
//               // 내가 틀렸다면
//               killer.push({
//                 id: i + 1,
//                 q_num: k[i].q_num,
//                 rate: k[i].rate,
//                 right_ans: k[i].right_ans,
//                 iscorrect: `나는 ${k[i].student_ans}를 선택하여 틀렸어요.`,
//                 mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
//               });
//             } else {
//               killer.push({
//                 id: i + 1,
//                 q_num: k[i].q_num,
//                 rate: k[i].rate,
//                 right_ans: k[i].right_ans,
//                 iscorrect: '나는 맞았어요!',
//                 mostchosen: `학생들은 ${best1}, ${best2}, ${best3} 순으로 많이 선택했어요.`,
//               });
//             }
//           }
//           console.log('killer', killer);
//           setKiller(killer);
//         }
//       })
//       .catch(error => console.error(error));
//   };
//   const setmycorrect = top5 => {
//     let correct = [];
//     console.log('top5', top5);
//     for (let i = 0; i < 5; i++) {
//       if (top5[i].isCorrect == false) {
//         // 내가 이 문제를 틀렸다면
//         correct.push({
//           id: i + 1,
//           rank: top5[i].q_rank,
//           q_num: top5[i].q_num,
//           rate: top5[i].rate,
//           my_ans: `내 답:${top5[i].student_ans}/`,
//           ans: `답:${top5[i].right_ans}`,
//           correct: 'X',
//         });
//       } else {
//         correct.push({
//           id: i,
//           rank: top5[i].q_rank,
//           q_num: top5[i].q_num,
//           rate: top5[i].rate,
//           my_ans: '',
//           ans: '맞았습니다!',
//           correct: 'O',
//         });
//       }
//     }
//     settop5(correct);
//     console.log(top5);
//   };
//
//   useEffect(() => {
//     getAttendances();
//     getTypeResult();
//     console.log('AttendanceList : ', TestList);
//     console.log('listLength : ', listLength);
//   }, [listLength]);
//
//   return (
//     <SafeAreaView style={styles.container}>
//       {/*<ScrollView>*/}
//       {/*<StatusBar style="auto" />*/}
//       <View style={{marginTop: '10%'}}>
//         <View style={styles.myInfo}>
//           <View style={styles.scoreBox}>
//             <Text style={styles.rankScore}>순위 </Text>
//             <Text style={styles.number}> {MyRank}위</Text>
//             <Text style={styles.totalAvg}>/ {total} 명</Text>
//           </View>
//           <View style={styles.scoreBox}>
//             <Text style={styles.rankScore}>점수 </Text>
//             <Text style={styles.number}> {MyScore}점</Text>
//             <Text style={styles.totalAvg}>/ 평균 {avg} 점</Text>
//           </View>
//         </View>
//         <View style={styles.contentsContainer}>
//           <View style={styles.topTitle}>
//             <Text style={styles.topFont}>오답률 Top 5</Text>
//           </View>
//           <FlatList
//             data={top5}
//             renderItem={({item, index}) => (
//               <View style={styles.contentList}>
//                 <Text style={styles.topRank}>{item.rank}위 </Text>
//                 <Text style={styles.probNum}>{item.q_num}번</Text>
//                 <Text
//                   style={{
//                     marginTop: 4,
//                     marginLeft: 110,
//                     position: 'absolute',
//                     fontSize: 16,
//                     color: 'black',
//                   }}>
//                   ({item.rate}%)
//                 </Text>
//                 <Text
//                   style={
//                     item.correct === 'O'
//                       ? StyleSheet.compose(styles.wrong, styles.correct)
//                       : styles.wrong
//                   }>
//                   {item.correct}
//                 </Text>
//                 <Text
//                   style={{
//                     marginLeft: 230,
//                     position: 'absolute',
//                     fontSize: 16,
//                     color: 'black',
//                   }}>
//                   {item.my_ans} {item.ans}
//                 </Text>
//               </View>
//             )}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </View>
//       </View>
//       {/*</ScrollView>*/}
//     </SafeAreaView>
//   );
// };

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
  contentList: {
    borderRadius: 27,
    borderColor: '#1a91ff',
    borderWidth: 2,
    justifyContent: 'center',
    paddingVertical: '5%',
    marginVertical: 2,
    marginHorizontal: '4%',
    backgroundColor: 'white',
  },
  topTitle: {
    // marginTop: 8,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3%',
  },
  topFont: {
    fontSize: 28,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
  },
  topRank: {
    marginLeft: 15,
    position: 'absolute',
    fontFamily: Fonts.TRBold,
    fontSize: 22,
    color: '#f97316',
  },
  probNum: {
    marginLeft: 60,
    position: 'absolute',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: '#fb923c',
  },
  correct: {
    marginLeft: 190,
    position: 'absolute',
    fontSize: 20,
    color: '#0077e6',
    fontWeight: 'bold',
  },
  wrong: {
    marginLeft: 190,
    position: 'absolute',
    fontSize: 20,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  killerBox_list: {
    borderRadius: 20,
    borderColor: '#1a91ff',
    borderWidth: 2,
    // justifyContent: 'center',
    paddingVertical: '5%',
    marginVertical: 2,
    marginHorizontal: '4%',
    backgroundColor: 'white',
  },
  killerBox_title: {
    // backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
  },
  killerBox_content: {
    paddingTop: '5%',
    justifyContent: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'pink',
  },
  killerExplain: {
    // padding: 3,
    lineHeight: 30,
    fontSize: 18,
    color: 'black',
    fontFamily: Fonts.TRBold,
  },
  wrongRate: {
    marginLeft: 120,
    // position: 'absolute',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: '#1a91ff',
  },
  button: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: '#0077e6',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: '3%',
  },
});

export default StudentTestResult;
