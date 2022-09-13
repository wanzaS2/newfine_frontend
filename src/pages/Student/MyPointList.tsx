import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {Alert, FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Fonts} from '../../assets/Fonts';
import {width, height} from '../../config/globalStyles';

function MyPointList() {
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
      console.log(accessToken);

      let list = [];
      for (let i = 0; i < response.data.data.length; i++) {
        list.push({
          contents: response.data.data[i].contents,
          date: response.data.data[i].date.substring(0, 10),
          // year: response.data.data[i].date[0],
          // month: response.data.data[i].date[1],
          // day: response.data.data[i].date[2],
          // hour: response.data.data[i].date[3],
          // minutes: response.data.data[i].date[4],
          // sec: response.data.data[i].date[5],
          time: response.data.data[i].date.substring(11),
          score: response.data.data[i].score,
          scoreSum: response.data.data[i].scoreSum,
        });
      }

      console.log('포인트 리스트: ', list);
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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.listArea}>
        <FlatList
          ref={scrollRef}
          data={pointInfo}
          keyExtractor={(item, index) => {
            return `pointHistory-${index}`;
          }}
          renderItem={({item, index}) => (
            <View style={styles.flatList}>
              <Text style={styles.textTop}>
                {item.date} | {item.time} | {item.contents} | {item.score}점
              </Text>
              <Text style={styles.textBottom}>
                누적 포인트 : {item.scoreSum}
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
    backgroundColor: 'white',
    //
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  listArea: {
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    height: height * 60,
    alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: height * 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: width * 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: width * 5,
          height: height * 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  textTop: {fontFamily: Fonts.TRRegular, fontSize: width * 13},
  textBottom: {fontFamily: Fonts.TRBold, fontSize: width * 17, color: 'black'},
});

export default MyPointList;
