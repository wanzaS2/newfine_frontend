import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useFocusEffect} from '@react-navigation/native';
import {Fonts} from '../assets/Fonts';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function AllRanking({navigation}) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [rankingList, setRankingList] = useState();
  const [listLength, setListLength] = useState();
  const [rankInfo, setRankInfo] = useState([]);
  const [rankNumber, setRankNumber] = useState([]);
  const [sorting, setSorting] = useState('pointDesc');
  const scrollRef = useRef();

  const getRanking = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/ranking/allRank`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('리스트 출력: ', response.data);
      setRankingList(response.data.data);
      setListLength(response.data.data.length);

      // let list = [];
      // for (let i = 0; i < response.data.data.length; i++) {
      //   list.push({
      //     nickname: response.data.data[i].nickname,
      //     score: response.data.data[i].score,
      //   });
      // }

      // console.log(list);
      // setRankInfo(list);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRanking();
    }, []),
  );

  useEffect(() => {
    getRanking();
    console.log('rankingList : ', rankingList);
    console.log('listLength : ', listLength);
    rank_num_function();
    setRankNumber(list);
  }, [sorting, listLength]);

  let list = [1]; //순위가 담길 배열. 처음 사람은 1위 고정
  let temp = 0; //공동 순위 동안 누적될 순위
  let rank_number = 1; //실제 표시될 순위

  //공동 순위 구현함수
  const rank_num_function = () => {
    //for문으로 리스트 전체 탐색하면서 이전 인덱스랑 점수가 같으면 순위 그대로 유지하고 temp(누적되는 순위) 1 증가
    //다르면 누적된 만큼 +해서 순위 출력 후 temp=0으로 초기화
    for (let i = 1; i < listLength; i++) {
      if (rankingList[i].score === rankingList[i - 1].score) {
        list.push(rank_number);
        temp += 1;
      } else {
        rank_number += 1 + temp;
        list.push(rank_number);
        temp = 0;
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <FlatList
        style={{marginTop: 15}}
        ref={scrollRef}
        data={rankingList}
        keyExtractor={(item, index) => {
          return `pointHistory-${index}`;
        }}
        renderItem={({item, index}) => (
          <View
            style={{
              width: screenWidth - 10,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              borderRadius: 8,
              borderColor: 'skyblue',
              borderWidth: 2,
              backgroundColor:
                rankNumber[index] === 1
                  ? 'lightyellow'
                  : rankNumber[index] === 2
                  ? 'gainsboro'
                  : rankNumber[index] === 3
                  ? 'tan'
                  : 'white',
            }}>
            <Text style={styles.textBottom}>{rankNumber[index]}위</Text>
            <Text style={styles.textBottom}>
              {item.nickname}님 {item.score}점
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textTop: {fontFamily: Fonts.TRRegular, fontSize: 13},
  textBottom: {fontFamily: Fonts.TRBold, fontSize: 17},
});
export default AllRanking;
