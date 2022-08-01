import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View, Text} from 'react-native';
// import {ranking} from '../slices/ranking';
// import EachRanking from '../components/EachRanking';
import Config from 'react-native-config';
import axios from 'axios';

function Ranking() {
  const [loading, setLoading] = useState(false);
  const [rankingList, setRankingList] = useState();
  const [listLength, setListLength] = useState();
  const [rankNumber, setRankNumber] = useState([]);

  const getRankingInfo = () => {
    axios(`${Config.API_URL}/ranking/ranking`)
      .then(response => {
        setRankingList(response.data);
        setListLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getRankingInfo();
    console.log('rankingList : ', rankingList);
    console.log('listLength : ', listLength);
    rank_num_function();
    setRankNumber(list);
  }, [listLength]);

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
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={rankingList}
          keyExtractor={(item, index) => {
            return `pointHistory-${index}`;
          }}
          renderItem={({item, index}) => (
            <View
              style={{
                borderRadius: 10,
                borderColor: 'gray',
                borderWidth: 1,
                padding: 10,
                marginBottom: 10,
                backgroundColor: 'pink',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderRightWidth: 2,
                    borderColor: 'green',
                    height: 56,
                    width: 70,
                    backgroundColor:
                      rankNumber[index] === 1
                        ? '#ffd700'
                        : rankNumber[index] === 2
                        ? '#c0c0c0'
                        : rankNumber[index] === 3
                        ? '#c49c48'
                        : 'white',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                    }}>
                    {rankNumber[index]}위
                  </Text>
                </View>
                <Text style={{marginLeft: 30, fontSize: 20}}>
                  {item.nickname}
                </Text>
                <Text style={{position: 'absolute', right: 30, fontSize: 20}}>
                  {item.point}포인트
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
});

export default Ranking;
