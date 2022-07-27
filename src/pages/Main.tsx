import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList, RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import SetUpProfile from '../components/SetUpProfile';
import {Fonts} from '../assets/Fonts';
import Ranking from './Ranking';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import axios from 'axios';
import Config from 'react-native-config';

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function Main() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const photoUrl = useSelector((state: RootState) => state.user.photoURL);
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const [myRank, setMyRank] = useState();

  const getMyRank = async () => {
    const response = await axios.get(`${Config.API_URL}/ranking/myRank`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('내 랭킹:', response.data);
    setMyRank(response.data.data);
  };

  useEffect(() => {
    getMyRank();
  }, []);

  const getPoint = async () => {
    const response = await axios.post(
      `${Config.API_URL}/member/point`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(response.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        <Pressable
          onPress={() => {
            navigation.navigate('MyPage');
          }}>
          <Image
            source={{uri: photoUrl}}
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              borderColor: 'skyblue',
              borderWidth: 5,
            }}
          />
          <Text>
            {nickname}님 랭킹은 *{myRank}위입니다~~~~~!
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <LinearGradient
            colors={['skyblue', 'lightcyan']}
            style={styles.block}>
            <Pressable>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/main/free-icon-teach-4696563.png')}
                  style={styles.blockImage}
                />
                <Text style={styles.blockTitle}>수업</Text>
              </View>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            colors={['skyblue', 'lightcyan']}
            style={styles.block}>
            <Pressable style={styles.block}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/main/free-icon-campus-4696591.png')}
                  style={styles.blockImage}
                />
                <Text style={styles.blockTitle}>출석</Text>
              </View>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            colors={['skyblue', 'lightcyan']}
            style={styles.block}>
            <Pressable style={styles.block}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/main/free-icon-study-4696502.png')}
                  style={styles.blockImage}
                />
                <Text style={styles.blockTitle}>과제</Text>
              </View>
            </Pressable>
          </LinearGradient>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Pressable
            style={styles.block}
            onPress={() => {
              getPoint();
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/images/main/free-icon-read-4696561.png')}
                style={styles.blockImage}
              />
              <Text style={styles.blockTitle}>자습</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.block}
            onPress={() => {
              navigation.navigate('AllRanking');
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/images/main/free-icon-checklist-4696519.png')}
                style={styles.blockImage}
              />
              <Text style={styles.blockTitle}>테스트</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.block}
            onPress={() => {
              navigation.navigate('MyPointList');
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/images/main/free-icon-sports-4696513.png')}
                style={styles.blockImage}
              />
              <Text style={styles.blockTitle}>내 정보</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  block: {
    // backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 25,
    borderColor: 'lightgrey',
    borderWidth: 1,
    // marginHorizontal: 5,
    // marginVertical: 5,
  },
  blockTitle: {
    marginTop: 10,
    fontFamily: Fonts.TRBold,
    fontSize: 20,
    color: 'dodgerblue',
  },
  blockImage: {width: 65, height: 65},
});

export default Main;
