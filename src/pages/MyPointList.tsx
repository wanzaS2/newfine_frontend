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

function MyPointList({navigation}) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [pointInfo, setPointInfo] = useState([]);
  const [sorting, setSorting] = useState('pointDesc');
  const scrollRef = useRef();

  const getPointHistory = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/point/${sorting}`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('리스트 출력1: ', response.data);
      console.log('리스트 출력2: ', response.data.data);

      let list = [];
      for (let i = 0; i < response.data.data.length; i++) {
        list.push({
          contents: response.data.data[i].contents,
          date: response.data.data[i].date.substr(0, 10),
          time: response.data.data[i].date.substr(11, 5),
          score: response.data.data[i].score,
          scoreSum: response.data.data[i].scoreSum,
        });
      }

      console.log(list);
      setPointInfo(list);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPointHistory();
    }, []),
  );

  useEffect(() => {
    getPointHistory();
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
        data={pointInfo}
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
            <Text style={styles.textTop}>
              {item.date} | {item.time} | {item.contents} | {item.score}점
            </Text>
            <Text style={styles.textBottom}>누적 포인트 : {item.scoreSum}</Text>
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
export default MyPointList;
