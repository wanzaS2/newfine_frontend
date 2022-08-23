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

function TestRank({route, navigation}) {
  console.log('전달받은 것', route.params);
  const [TestList, setTestList] = useState();
  const [highest, sethighest] = useState();
  const [lowest, setlowest] = useState();
  const [avg, setAvg] = useState();
  const [top5, settop5] = useState();
  const [listLength, setAttendanceLength] = useState();
  const [ranklen, setRankLength] = useState();
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
        setAvg(response.data.avg);
        sethighest(response.data.highest);
        setlowest(response.data.lowest);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const getRank = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/result/rank/teacher`, {
      params: {id: route.params},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setTestList(response.data);
        setRankLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAttendances();
    getRank();
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
              <Text style={styles.topfont}>순위</Text>
            </View>
            <FlatList
              data={TestList}
              renderItem={({item, index}) => (
                <View style={styles.box_list}>
                  <View style={styles.box}>
                    <Text style={styles.toprank}>{item.rank}위 </Text>
                    <Text
                      style={{
                        marginLeft: 135,
                        position: 'absolute',
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#87cefa',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        marginLeft: 225,
                        position: 'absolute',
                        fontSize: 18,
                      }}>
                      {item.score}점
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
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
  box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
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
    height: 2680,
    justifyContent: 'flex-start',
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'lightskyblue',
    borderWidth: 8,
    marginBottom: 10,
    // fontFamily: Fonts.TRBold,
    backgroundColor: '#f0f8ff',
    // backgroundColor: '#fafad2',
  },
  toptitle: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  topfont: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffa07a',
    // fontFamily: Fonts.TRBold,
  },
  toprank: {
    marginLeft: 50,
    fontSize: 22,
    fontWeight: '900',
    color: '#ffa07a',
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

export default TestRank;
