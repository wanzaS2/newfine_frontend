import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {Fonts} from '../assets/Fonts';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

function SignIn({navigation}: SignInScreenProps) {
  // const nav = useNavigation<NavigationProp<LoggedInParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const phoneNumberRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  // const isProfile = useSelector((state: RootState) => !!state.user.nickname);

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
      const responseT = await axios.post(`${Config.API_URL}/auth/login`, {
        phoneNumber,
        password,
      });
      console.log(responseT.data); // 토큰 정보 출력
      dispatch(
        userSlice.actions.setAccessToken({
          accessToken: responseT.data.accessToken,
        }),
      );
      dispatch(
        userSlice.actions.setAuthority({
          authority: responseT.data.authority,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        responseT.data.refreshToken,
      );
      await EncryptedStorage.setItem('accessToken', responseT.data.accessToken);

      const accessToken = await EncryptedStorage.getItem('accessToken');

      // console.log('response 받은 거: ', responseT.data.accessToken);
      // console.log('로컬에서 꺼내온 거: ', accessToken);
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
        Alert.alert('알림', '로그인 되었습니다.');
        // if (!isProfile) {
        //   nav.navigate('Welcome');
        // } else {
        //   nav.navigate('Main');
        // }
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
      }
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, phoneNumber, password, dispatch]);
  // }, [loading, phoneNumber, password, dispatch, isProfile, nav]);

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
              color: 'black',
              // lineHeight: 50,
            }}>
            Welcome!
          </Text>
          <Text
            style={{fontFamily: Fonts.TRBold, fontSize: 40, color: 'black'}}>
            <Text style={{color: 'darkblue'}}>New</Text>
            <Text style={{color: 'darkorange'}}>Fine</Text>
            <Text style={{fontSize: 25, color: 'black'}}>과 함께</Text>
          </Text>
          <Text
            style={{
              fontFamily: Fonts.TRBold,
              fontSize: 30,
              color: 'black',
              // lineHeight: 35,
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
            disabled={!canGoNext || loading}
          />
          <View style={styles.inputWrapper}>
            <Pressable style={{alignItems: 'center'}} onPress={toSignUpAuth}>
              <Text
                style={{
                  fontFamily: Fonts.TRRegular,
                  textDecorationLine: 'underline',
                  fontSize: 14,
                }}>
                회원가입
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
                    fontSize: 14,
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
    paddingTop: '15%',
    paddingBottom: '10%',
    // backgroundColor: 'green',
    alignItems: 'center',
  },
  loginArea: {
    // backgroundColor: 'powderblue',
  },
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor: 'white',
  },
  label: {
    color: 'black',
    fontFamily: Fonts.TRBold,
    fontSize: 19,
  },
});

export default SignIn;
