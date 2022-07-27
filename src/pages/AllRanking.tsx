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
  const [rankInfo, setRankInfo] = useState([]);
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

      let list = [];
      for (let i = 0; i < response.data.data.length; i++) {
        list.push({
          nickname: response.data.data[i].nickname,
          score: response.data.data[i].score,
        });
      }

      console.log(list);
      setRankInfo(list);
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
  }, [sorting]);

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
        data={rankInfo}
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
            }}>
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
