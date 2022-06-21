import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {RootStackParamList} from '../../AppInner';
import {Fonts} from '../assets/Fonts';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef<TextInput | null>(null);
  const nicknameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeUsername = useCallback(text => {
    setUsername(text.trim());
  }, []);
  const onChangeNickname = useCallback(text => {
    setNickname(text.trim());
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
    if (!nickname || !nickname.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    //
    //
    //  아이디 중복 확인 만들기
    //
    //
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    console.log(username, nickname, password);
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/auth/signup`, {
        username,
        nickname,
        password,
      });
      console.log(response.data);
      Alert.alert('알림', '회원가입 되었습니다.');
      navigation.navigate('SignIn');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, navigation, username, nickname, password]);

  const canGoNext = username && nickname && password;
  return (
    <SafeAreaView>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeUsername}
            placeholder="아이디를 입력해주세요"
            placeholderTextColor="#666"
            textContentType="username"
            value={username}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={usernameRef}
            onSubmitEditing={() => nicknameRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.textInput}
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#666"
            onChangeText={onChangeNickname}
            value={nickname}
            textContentType="name"
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={nicknameRef}
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
            onChangeText={onChangePassword}
            value={password}
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'ascii-capable'
            }
            textContentType="password"
            secureTextEntry
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
          {/*<View style={{margin: 5}}></View>*/}
          {/*<TextInput*/}
          {/*  style={styles.textInput}*/}
          {/*  placeholder="비밀번호 확인"*/}
          {/*  placeholderTextColor="#666"*/}
          {/*  onChangeText={onChangePassword}*/}
          {/*  value={password}*/}
          {/*  keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}*/}
          {/*  textContentType="password"*/}
          {/*  secureTextEntry*/}
          {/*  returnKeyType="send"*/}
          {/*  clearButtonMode="while-editing"*/}
          {/*  ref={passwordRef}*/}
          {/*  onSubmitEditing={onSubmit}*/}
          {/*/>*/}
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
              <Text style={styles.loginButtonText}>회원가입</Text>
            )}
          </Pressable>
        </View>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // textInput: {
  //   padding: 5,
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  // },
  textInput: {
    backgroundColor: 'lightgrey',
    fontFamily: Fonts.TRRegular,
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: 'darkblue',
    // borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  inputWrapper: {
    paddingTop: 20,
    padding: 10,
  },
  label: {
    fontFamily: Fonts.TRBold,
    fontSize: 18,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  buttonZone: {
    paddingTop: 20,
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

export default SignUp;
