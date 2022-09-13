import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import axios from 'axios';
import Config from 'react-native-config';
import ServiceList from '../../components/ServiceList';
import services from '../../assets/mock/services.json';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {width, height} from '../../config/globalStyles';

type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'StudentMain'>;

function StudentMain({navigation}: MainScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const photoUrl = useSelector((state: RootState) => state.user.photoURL);
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const [myRank, setMyRank] = useState();
  const [myTier, setMyTier] = useState();

  const words = [
    '오늘도 화이팅!',
    '아자아자!!',
    '행복하세요~',
    '넌 짱이야..',
    '즐공~ 열공~ 빡공~',
    '레쭈고! 레쭈고!! 레쭈고!!!',
    '힘내',
    '할 수 있다!!!!',
    '100점 맞으세요',
  ];

  const getRandomIndex = function (length) {
    return parseInt(Math.random() * length);
  };

  const getMyRank = async () => {
    const response = await axios.get(`${Config.API_URL}/ranking/myRank`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('내 랭킹:', response.data);
    setMyRank(response.data.data.myRank);
    setMyTier(response.data.data.myTier);
  };

  useFocusEffect(
    useCallback(() => {
      getMyRank();
    }, []),
  );

  const showImage = () => {
    if (!photoUrl) {
      return (
        <View style={styles.imageArea}>
          <Ionicons name={'laugh-wink'} size={width * 130} color={'#e0f2fe'} />
        </View>
      );
    } else {
      console.log(photoUrl);
      return (
        <View style={styles.imageArea}>
          <Image source={{uri: photoUrl}} style={styles.profileImage} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upBlock}>
        {/*<Pressable*/}
        {/*  style={({pressed}) => [*/}
        {/*    {*/}
        {/*      backgroundColor: pressed ? '#f0f9ff' : 'white',*/}
        {/*      width: pressed ? 108 : 110,*/}
        {/*      height: pressed ? 108 : 110,*/}
        {/*    },*/}
        {/*    styles.bigButton,*/}
        {/*  ]}*/}
        {/*  onPress={() => {*/}
        {/*    navigation.navigate('RankingPoint');*/}
        {/*  }}>*/}
        <RNBounceable
          onPress={() => navigation.navigate('RankingPoint')}
          style={styles.bigButton}>
          <View style={{flexDirection: 'row', width: '100%', height: '70%'}}>
            {showImage()}
            {/*<Image source={{uri: photoUrl}} style={styles.profileImage} />*/}
            <View style={styles.textArea}>
              <Text style={{marginBottom: '10%'}}>
                <Text style={styles.bigText}>{nickname}</Text>
                {/*<Text style={styles.smallText}> 님</Text>*/}
              </Text>
              <Text style={{marginBottom: '10%'}}>
                <Text style={styles.smallText}>전체</Text>
                <Text style={styles.bigText}> {myRank}</Text>
                <Text style={styles.smallText}> 위</Text>
              </Text>
              <Text style={{marginBottom: '10%'}}>
                <Text style={styles.bigText}>
                  TIER{'\n'}
                  <Text
                    style={{
                      fontSize:
                        myTier === 'CHALLENGER' ? width * 20 : width * 25,
                      color:
                        myTier === 'CHALLENGER' ? "crimson" :
                            myTier === 'MASTER' ? "darkmagenta" :
                                myTier === 'DIA' ? "cornflowerblue" :
                                    myTier === 'PLATINUM' ? "lightseagreen" :
                                        myTier === 'GOLD' ? "gold" : "darkblue",
                    }}>
                    {myTier}
                  </Text>
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: '5%',
              marginVertical: '8%',
              alignItems: 'center',
            }}>
            <Text style={styles.bigText}>
              {words[getRandomIndex(words.length)]}
            </Text>
          </View>
        </RNBounceable>
      </View>
      <View style={styles.bottomBlock}>
        <ServiceList list={services} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  upBlock: {
    // backgroundColor: 'yellow',
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '90%',
    // borderColor: 'lightgrey',
    // marginHorizontal: 5,
    // marginVertical: 5,
  },
  bottomBlock: {
    flex: 1,
  },
  bigButton: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    marginHorizontal: width * 10,
    borderRadius: 16,
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
        elevation: 5,
      },
    }),
  },
  imageArea: {
    margin: '3%',
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    // margin: '3%',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderColor: '#e0f2fe',
    borderWidth: 4,
  },
  textArea: {
    // backgroundColor: 'pink',
    width: '40%',
    justifyContent: 'center',
    height: '100%',
    marginVertical: '5%',
  },
  bigText: {
    fontFamily: Fonts.TRBold,
    fontSize: width * 25,
    color: 'darkblue',
  },
  smallText: {
    fontFamily: Fonts.TRBold,
    fontSize: width * 17,
    color: 'black',
  },
});

export default StudentMain;
