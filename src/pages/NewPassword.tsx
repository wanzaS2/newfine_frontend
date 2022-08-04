import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import DismissKeyboardView from '../components/DismissKeyboardView';
import MyTextInput from '../components/MyTextInput';
import MyButton from '../components/MyButton';
import {Fonts} from '../assets/Fonts';

function NewPassword({navigation}) {
  const [loadingP, setLoadingP] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [chkPassword, setChkPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [chkAuthCode, setChkAuthCode] = useState('');
  const phoneNumberRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const chkPasswordRef = useRef<TextInput | null>(null);
  const authCodeRef = useRef<TextInput | null>(null);

  const onChangePhoneNumber = useCallback(text => {
    setPhoneNumber(text.trim());
  }, []);
  const onChangeNewPassword = useCallback(text => {
    setNewPassword(text.trim());
  }, []);
  const onChangeChkPassword = useCallback(text => {
    setChkPassword(text.trim());
  }, []);
  const onChangeAuthCode = useCallback(text => {
    setAuthCode(text.trim());
  }, []);

  const onSubmitPhoneNumber = useCallback(async () => {
    if (loadingP) {
      return;
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return Alert.alert('알림', '전화번호를 입력해주세요.');
    }
    // if (phoneNumber.length < 11) {
    //   setButtonReady(false);
    // } else {
    //   setButtonReady(true);
    // }
    // if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
    //   return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    // }
    // console.log(phoneNumber);
    try {
      setLoadingP(true);
      const response = await axios.post(
        `${Config.API_URL}/member/sendMessage`,
        {
          phoneNumber,
        },
      );
      setChkAuthCode(response.data);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoadingP(false);
    }
  }, [loadingP, phoneNumber]);

  const onSubmitAuthCode = useCallback(async () => {
    if (loadingA) {
      return;
    }
    // if (authCode.length < 4) {
    //   setAuthButtonReady(false);
    // } else {
    //   setAuthButtonReady(true);
    // }
    if (authCode != chkAuthCode) {
      return Alert.alert('알림', '인증번호가 일치하지 않습니다.');
    }
    console.log(authCode, chkAuthCode);
    try {
      setLoadingA(true);
      Alert.alert('알림', '전화번호 인증이 완료되었습니다.');
    } catch (error) {
      // const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      // if (errorResponse) {
      //   Alert.alert('알림', errorResponse.data.message);
      // }
    } finally {
      setLoadingA(false);
    }
  }, [loadingA, authCode, chkAuthCode]);

  const onSubmitPassword = useCallback(async () => {
    if (loadingPw) {
      return;
    }
    if (!newPassword || !newPassword.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (!chkPassword || !chkPassword.trim()) {
      return Alert.alert('알림', '비밀번호 확인을 해주세요.');
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(newPassword)
    ) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    if (newPassword !== chkPassword) {
      return Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
    }
    console.log(newPassword);
    try {
      console.log('핸폰 번호: ', phoneNumber);
      setLoadingPw(true);
      const response = await axios.post(
        `${Config.API_URL}/member/newPassword`,
        {phoneNumber, newPassword},
      );
      console.log('비번 변경 완. : ', response.data);
      Alert.alert('알림', '비밀번호가 변경되었습니다.');
      navigation.navigate('SignIn');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoadingPw(false);
    }
  }, [loadingPw, newPassword, chkPassword, phoneNumber, navigation]);

  const canGoNextP = phoneNumber;
  const canGoNextA = authCode;
  const canGoNextPw = newPassword && chkPassword;
  return (
    <SafeAreaView>
      <DismissKeyboardView>
        <View>
          <View>
            <Text>전화번호</Text>
          </View>
          <MyTextInput
            onChangeText={onChangePhoneNumber}
            placeholder="하이픈 없이 11자리 전화번호를 입력해주세요."
            placeholderTextColor="#666"
            maxLength={11}
            textContentType="telephoneNumber"
            keyboardType={'number-pad'}
            value={phoneNumber}
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={phoneNumberRef}
            onSubmitEditing={onSubmitPhoneNumber}
            blurOnSubmit={false}
          />
          <MyButton
            loading={loadingP}
            text="인증번호 발송"
            onPress={onSubmitPhoneNumber}
            canGoNext={canGoNextP}
            disable={!canGoNextP || loadingP}
          />
        </View>
        <View>
          <MyTextInput
            onChangeText={onChangeAuthCode}
            placeholder="인증번호 4자리를 입력해주세요"
            placeholderTextColor="#666"
            maxLength={4}
            textContentType="telephoneNumber"
            keyboardType={'number-pad'}
            value={authCode}
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={authCodeRef}
            onSubmitEditing={onSubmitAuthCode}
            blurOnSubmit={false}
          />
          <MyButton
            loading={loadingA}
            text="확인"
            onPress={onSubmitAuthCode}
            canGoNext={canGoNextA}
            disabled={!canGoNextA || loadingA}
          />
        </View>
        <View>
          <Text>비밀번호</Text>
          <MyTextInput
            placeholder="비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
            placeholderTextColor="#666"
            onChangeText={onChangeNewPassword}
            value={newPassword}
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'ascii-capable'
            }
            textContentType="password"
            secureTextEntry
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={passwordRef}
            onSubmitEditing={() => chkPasswordRef.current?.focus()}
          />
          <View style={{margin: 5}} />
          <MyTextInput
            placeholder="비밀번호 확인"
            placeholderTextColor="#666"
            onChangeText={onChangeChkPassword}
            value={chkPassword}
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'ascii-capable'
            }
            textContentType="password"
            secureTextEntry
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={chkPasswordRef}
            onSubmitEditing={onSubmitPassword}
          />
        </View>
        <MyButton
          loading={loadingPw}
          text="비밀번호 바꾸기"
          onPress={onSubmitPassword}
          canGoNext={canGoNextPw}
          disable={!canGoNextPw || loadingPw}
        />
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    backgroundColor: 'green',
  },
  label: {
    fontFamily: Fonts.TRBold,
    fontSize: 18,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  textArea: {
    padding: 10,
    marginTop: '15%',
    justifyContent: 'center',
    marginBottom: 5,
  },
  box: {
    borderRadius: 10,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0ffff',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  font: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewPassword;
