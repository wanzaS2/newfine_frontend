import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
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
import Icon from 'react-native-vector-icons/FontAwesome';

type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'StudentMain'>;

const screenWidth = Dimensions.get('window').width;

function StudentMain({navigation}: MainScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const photoUrl = useSelector((state: RootState) => state.user.photoURL);
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const [myRank, setMyRank] = useState();
  const [myTier, setMyTier] = useState();

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
          <Ionicons name={'laugh-wink'} size={130} color={'#e0f2fe'} />
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

  // const getPoint = async () => {
  //   const response = await axios.post(
  //     `${Config.API_URL}/member/point`,
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     },
  //   );
  //   console.log(response.data);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upBlock}>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#f0f9ff' : 'white',
              width: pressed ? 108 : 110,
              height: pressed ? 108 : 110,
            },
            styles.bigButton,
          ]}
          onPress={() => {
            navigation.navigate('RankingPoint');
          }}>
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
                <Text style={styles.bigText}>TIER: {myTier}</Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: '5%',
              marginVertical: '8%',
              alignItems: 'center',
            }}>
            <Text style={styles.bigText}>레쭈고 ~ ~ ~ ~ ~ ~ !</Text>
          </View>
        </Pressable>
        {/*<Pressable*/}
        {/*  onPress={() => {*/}
        {/*    getPoint();*/}
        {/*  }}>*/}
        {/*  <Text>포인트!!</Text>*/}
        {/*</Pressable>*/}
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
    width: screenWidth - 40,
    height: '90%',
    // backgroundColor: 'green',
    marginHorizontal: 10,
    borderRadius: 16,
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
  // noProfileImage: {
  //   // margin: '3%',
  //   // width: '50%',
  //   // height: '100%',
  //   borderRadius: 16,
  //   // width: 250,
  //   // height: 250,
  //   // borderRadius: 125,
  //   borderColor: '#e0f2fe',
  //   borderWidth: 4,
  //   // alignItems: 'center',
  //   // justifyContent: 'center',
  // },
  textArea: {
    // backgroundColor: 'pink',
    width: '40%',
    justifyContent: 'center',
    height: '100%',
    marginVertical: '5%',
    marginHorizontal: '2%',
  },
  bigText: {
    fontFamily: Fonts.TRBold,
    fontSize: 25,
    color: 'darkblue',
  },
  smallText: {
    fontFamily: Fonts.TRBold,
    fontSize: 17,
    color: 'black',
  },
});

export default StudentMain;
