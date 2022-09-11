import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {useAppDispatch} from '../../store';
import teacherService from '../../assets/mock/teacherService.json';
import ColorfulCard from 'react-native-colorful-card';
import {Fonts} from '../../assets/Fonts';
import {TeacherParamList} from '../../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {width, height} from '../../config/globalStyles';

type TeacherMainScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'TeacherMain'
>;

function TeacherMain({navigation}: TeacherMainScreenProps) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const name = useSelector((state: RootState) => state.user.name);

  const onLogout = useCallback(async () => {
    try {
      console.log(accessToken);
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      const response = await axios.post(
        `${Config.API_URL}/auth/logout`,
        {accessToken, refreshToken},
        // {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // },
      );
      console.log(response.data);
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setTeacher({
          phoneNumber: '',
          name: '',
          authority: '',
        }),
      );
      dispatch(
        userSlice.actions.setAccessToken({
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('accessToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error('에러ㅓㅓㅓㅓㅓㅓㅓ: ', errorResponse);
    }
  }, [accessToken, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.textArea}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.welcomeText}> 선생님</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>환영합니다!! ^0^</Text>
          </View>
        </View>
        <View style={styles.blockArea}>
          <FlatList
            contentContainerStyle={{
              flex: 1,
              // backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={teacherService}
            renderItem={({item, index}) => (
              <ColorfulCard
                title={item.title}
                titleTextStyle={{
                  fontFamily: Fonts.TRRegular,
                  fontSize: width * 16,
                }}
                value={item.value}
                valueTextStyle={styles.value}
                // valuePostfix="h 42 m"
                // footerTitle="Deep Sleep"
                // footerValue="3h 13m"
                iconImageSource={require('../../assets/images/star.png')}
                // ImageComponent={<Icon name={item.icon} color={'white'} />}
                iconImageStyle={{tintColor: 'white', width: width * 25}}
                style={{
                  backgroundColor: item.backgroundColor,
                  marginHorizontal: width * 5,
                  marginVertical: height * 10,
                }}
                onPress={() => {
                  console.log(item.value === '로그아웃');
                  if (item.value != '로그아웃') {
                    navigation.navigate(item.onPress);
                  } else {
                    onLogout();
                  }
                }}
              />
            )}
            numColumns={2}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  textArea: {
    flex: 1,
    paddingTop: height * 30,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
  },
  welcomeText: {
    fontFamily: Fonts.TRBold,
    fontSize: width * 30,
    color: 'black',
  },
  nameText: {
    fontFamily: Fonts.TRBold,
    fontSize: width * 32,
    color: '#0077e6',
  },
  blockArea: {
    flex: 6,
    flexDirection: 'row',
    marginBottom: height * 30,
    // backgroundColor: 'yellow',
  },
  inputWrapper: {
    paddingTop: height * 20,
    paddingHorizontal: width * 10,
    paddingVertical: height * 10,
    alignItems: 'center',
  },
  value: {
    // fontFamily: Fonts.TRBold,
    fontFamily: 'TmoneyRoundWind-ExtraBold',
    lineHeight: height * 35,
  },
});

export default TeacherMain;
