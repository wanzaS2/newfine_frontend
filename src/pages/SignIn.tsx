import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  SafeAreaView,
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

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeUsername = useCallback(text => {
    setUsername(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!username || !username.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        username,
        password,
      });
      console.log(response.data);
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          nickname: response.data.data.nickname,
          username: response.data.data.username,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, username, password]);

  // const toSignUp = useCallback(() => {
  //   navigation.navigate('SignUp');
  // }, [navigation]);

  const toSignUpAuth = useCallback(() => {
    navigation.navigate('SignUpAuth');
  }, [navigation]);

  const canGoNext = username && password;
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
            레쭈고~~~~~~~~~!:D
          </Text>
        </View>
        <View style={styles.loginArea}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeUsername}
              placeholder="아이디를 입력해주세요"
              placeholderTextColor="#666"
              importantForAutofill="yes"
              autoComplete="username"
              textContentType="username"
              value={username}
              returnKeyType="next"
              clearButtonMode="while-editing"
              ref={usernameRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.textInput}
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
          <View style={styles.buttonZone}>
            <Pressable
              style={
                canGoNext
                  ? StyleSheet.compose(
                      styles.loginButton,
                      styles.loginButtonActive,
                    )
                  : styles.loginButton
              }
              disabled={!canGoNext || loading}
              onPress={onSubmit}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </Pressable>
            <Pressable onPress={toSignUpAuth}>
              <Text style={{fontFamily: Fonts.TRRegular}}>회원가입하기</Text>
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
  textInput: {
    backgroundColor: 'lightgrey',
    fontFamily: Fonts.TRRegular,
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 15,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: 'darkblue',
    // borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontFamily: Fonts.TRBold,
    fontSize: 17,
    marginBottom: 15,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'darkblue',
  },
  loginButtonText: {
    fontFamily: Fonts.TRRegular,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
