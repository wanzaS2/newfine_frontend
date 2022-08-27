import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {useFocusEffect} from '@react-navigation/native';
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type AllRankingScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'AllRanking'
>;

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function AllRanking({navigation}: AllRankingScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [rankingList, setRankingList] = useState();
  const [listLength, setListLength] = useState();
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
    <View style={styles.container}>
      <View style={styles.listArea}>
        <FlatList
          ref={scrollRef}
          data={rankingList}
          keyExtractor={(item, index) => {
            return `pointHistory-${index}`;
          }}
          renderItem={({item, index}) => (
            <View style={styles.flatList}>
              <Text style={styles.textTop}>{rankNumber[index]}위</Text>
              <Text style={styles.textBottom}>
                {item.nickname}님 {item.score}점
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'pink',
  },
  listArea: {
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    paddingVertical: 15,
    alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fdba74',
    // backgroundColor:
    //     rankNumber[index] === 1
    //         ? 'lightyellow'
    //         : rankNumber[index] === 2
    //             ? 'gainsboro'
    //             : rankNumber[index] === 3
    //                 ? 'tan'
    //                 : 'white',
    marginHorizontal: 10,
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
  textTop: {fontFamily: Fonts.TRBold, fontSize: 18, color: 'black'},
  textBottom: {fontFamily: Fonts.TRBold, fontSize: 20, color: 'black'},
});
export default AllRanking;
