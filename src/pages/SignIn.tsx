import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {LoggedInParamList, RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {Fonts} from '../assets/Fonts';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import messaging from "@react-native-firebase/messaging";
// import user from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const nav = useNavigation<NavigationProp<LoggedInParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const phoneNumberRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const isProfile = useSelector((state: RootState) => !!state.user.nickname);

  const a = useSelector((state: RootState) => state.user.accessToken);
  const deviceToken = useSelector((state: RootState) => state.user.deviceToken);

  // const authority = useSelector((state: RootState) => state.user.authority);

  const onChangePhoneNumber = useCallback(text => {
    setPhoneNumber(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return Alert.alert('알림', '전화번호를 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      console.log('phoneToken: ', deviceToken);
      const responseT = await axios.post(`${Config.API_URL}/auth/login`, {
        phoneNumber,
        password,
        deviceToken,
      });
      console.log(responseT.data); // 토큰 정보 출력
      dispatch(
        userSlice.actions.setAccessToken({
          accessToken: responseT.data.accessToken,
          // phoneNumber: response.data.phoneNumber,
          // nickname: response.data.nickname,
          // photoURL: response.data.photoURL,
        }),
      );
      dispatch(
        userSlice.actions.setAuthority({
          authority: responseT.data.authority,
          // phoneNumber: response.data.phoneNumber,
          // nickname: response.data.nickname,
          // photoURL: response.data.photoURL,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        responseT.data.refreshToken,
      );
      await EncryptedStorage.setItem('accessToken', responseT.data.accessToken);

      // console.log('response 받은 거: ', responseT.data.accessToken);
      // console.log(
      //   '로컬에서 꺼내온 거: ',
      //   await EncryptedStorage.getItem('accessToken'),
      // );

      const accessToken = await EncryptedStorage.getItem('accessToken');

      console.log('response 받은 거: ', responseT.data.accessToken);
      console.log('로컬에서 꺼내온 거: ', accessToken);

      // console.log('사인인페이지의 authority:      ', authority);

      if (responseT.data.authority === 'ROLE_USER') {
        const response = await axios.get(`${Config.API_URL}/member/me`, {
          params: {},
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);
        dispatch(
          userSlice.actions.setUser({
            phoneNumber: response.data.phoneNumber,
            nickname: response.data.nickname,
            photoURL: response.data.photoURL,
          }),
        );
        console.log(response.data);

        // ).then(async () => {
        //   await EncryptedStorage.getItem('accessToken', (err, result) => {
        //     axios
        //       .get(`${Config.API_URL}/member/me`, {
        //         params: {},
        //         headers: {
        //           Authorization: `Bearer ${result}`,
        //         },
        //       })
        //       .then(response =>
        //         dispatch(
        //           userSlice.actions.setUser({
        //             // accessToken: response.data.accessToken,
        //             phoneNumber: response.data.phoneNumber,
        //             nickname: response.data.data.nickname,
        //             photoURL: response.data.data.photoURL,
        //           }),
        //         ),
        //       );
        //   });
        // });

        //
        // await EncryptedStorage.getItem('accessToken', (err, result) => {
        //   const accessT = result;
        // });
        // const response = await axios.get(`${Config.API_URL}/member/me`, {
        //   params: {},
        //   headers: {
        //     Authorization: `Bearer ${accessT}`,
        //   },
        // });
        // dispatch(
        //   userSlice.actions.setUser({
        //     // accessToken: response.data.accessToken,
        //     phoneNumber: response.data.phoneNumber,
        //     nickname: response.data.nickname,
        //     photoURL: response.data.photoURL,
        //   }),
        // );
        // const accessToken = responseToken.data.accessToken;
        // const response = await axios.post(
        //   `${Config.API_URL}/auth/myInfo`,
        //   {},
        //   {
        //     headers: {
        //       token: accessToken,
        //       // token: `Bearer ${acT}`,
        //     },
        //     // headers: {authorization: `Bearer ${accessToken}`},
        //   },
        // );

        console.log('액토', a);

        Alert.alert('알림', '로그인 되었습니다.');
        if (!isProfile) {
          // dispatch(
          //   userSlice.actions.setPhoneNumber({
          //     phoneNumber: response.data.phoneNumber,
          //   }),
          // );
          nav.navigate('Welcome');
        } else {
          // dispatch(
          //   userSlice.actions.setUser({
          //     phoneNumber: response.data.phoneNumber,
          //     nickname: response.data.nickname,
          //     photoURL: response.data.photoURL,
          //   }),
          // );
          nav.navigate('Main');
        }
      } else {
        const response = await axios.get(`${Config.API_URL}/member/teacher`, {
          params: {},
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);
        dispatch(
          userSlice.actions.setTeacher({
            phoneNumber: response.data.phoneNumber,
            name: response.data.name,
          }),
        );
        console.log(response.data);
        Alert.alert('알림', '로그인 되었습니다.');
        // nav.navigate('TeacherMain');
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, phoneNumber, password, dispatch, a, isProfile, nav]);

  const toSignUpAuth = useCallback(() => {
    navigation.navigate('SignUpAuth');
  }, [navigation]);

  const canGoNext = phoneNumber && password;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.textArea}>
          <Text
            style={{
              fontFamily: Fonts.TRBold,
              fontSize: 40,
              lineHeight: 50,
            }}>
            Welcome!
          </Text>
          <Text style={{fontFamily: Fonts.TRBold, fontSize: 40}}>
            <Text style={{color: 'darkblue'}}>New</Text>
            <Text style={{color: 'darkorange'}}>Fine</Text>
            <Text style={{fontSize: 25}}>과 함께</Text>
          </Text>
          <Text
            style={{
              fontFamily: Fonts.TRBold,
              fontSize: 30,
              lineHeight: 35,
            }}>
            Fly High!!!:D
          </Text>
        </View>
        <View style={styles.loginArea}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>전화번호</Text>
            <MyTextInput
              onChangeText={onChangePhoneNumber}
              placeholder="전화번호를 입력해주세요"
              placeholderTextColor="#666"
              importantForAutofill="yes"
              autoComplete="tel"
              textContentType="telephoneNumber"
              keyboardType={'number-pad'}
              value={phoneNumber}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={phoneNumberRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>비밀번호</Text>
            <MyTextInput
              placeholder="비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
              placeholderTextColor="#666"
              importantForAutofill="yes"
              onChangeText={onChangePassword}
              value={password}
              autoComplete="password"
              textContentType="password"
              secureTextEntry
              returnKeyType="send"
              clearButtonMode="while-editing"
              ref={passwordRef}
              onSubmitEditing={onSubmit}
            />
          </View>
          <MyButton
            loading={loading}
            text="로그인"
            onPress={onSubmit}
            canGoNext={canGoNext}
            disable={!canGoNext || loading}
          />
          <View>
            <Pressable style={{alignItems: 'center'}} onPress={toSignUpAuth}>
              <Text
                style={{
                  fontFamily: Fonts.TRRegular,
                  textDecorationLine: 'underline',
                }}>
                회원가입하기
              </Text>
            </Pressable>
          </View>
          <View style={styles.inputWrapper}>
            <Pressable
              onPress={() => {
                navigation.navigate('NewPassword');
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: Fonts.TRRegular,
                    textDecorationLine: 'underline',
                  }}>
                  비밀번호를 잊어버리셨나요?
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  textArea: {
    padding: 20,
    marginTop: '15%',
    // marginLeft: '5%',
    // backgroundColor: 'lightyellow',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  loginArea: {
    // backgroundColor: 'powderblue',
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    // fontFamily: Fonts.TRBold,
    fontFamily: 'TmoneyRoundWind-ExtraBold',
    fontSize: 17,
    marginBottom: 15,
  },
});

export default SignIn;
