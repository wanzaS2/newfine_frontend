import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DismissKeyboardView from '../components/DismissKeyboardView';
import MyTextInput from '../components/MyTextInput';
import MyButton from '../components/MyButton';
import {Fonts} from '../assets/Fonts';
import OTPTextView from 'react-native-otp-textinput';
import Modal from 'react-native-modal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function NewPassword({navigation}: SignUpScreenProps) {
  const [loadingP, setLoadingP] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [chkPassword, setChkPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [chkAuthCode, setChkAuthCode] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [buttonReady, setButtonReady] = useState<boolean>(false); // 인증번호 발송 버튼
  const [authButtonReady, setAuthButtonReady] = useState<boolean>(false); // 확인 버튼
  const phoneNumberRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const chkPasswordRef = useRef<TextInput | null>(null);
  // const authCodeRef = useRef<TextInput | null>(null);

  const onChangePhoneNumber = useCallback(text => {
    setPhoneNumber(text.trim());
    if (text.length < 11) {
      setButtonReady(false);
    } else if (text.length === 11) {
      setButtonReady(true);
    }
  }, []);
  const onChangeAuthCode = useCallback(text => {
    setAuthCode(text.trim());
    if (text.length < 4) {
      setAuthButtonReady(false);
    } else if (text.length === 4) {
      setAuthButtonReady(true);
    }
  }, []);
  const onChangeNewPassword = useCallback(text => {
    setNewPassword(text.trim());
  }, []);
  const onChangeChkPassword = useCallback(text => {
    setChkPassword(text.trim());
  }, []);

  const onSubmitPhoneNumber = useCallback(async () => {
    if (loadingP) {
      return;
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return Alert.alert('알림', '전화번호를 입력해주세요.');
    }
    if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
      return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    }
    console.log(phoneNumber);
    try {
      setLoadingP(true);
      const response = await axios.post(`${Config.API_URL}/auth/sendMessage`, {
        phoneNumber,
      });
      setChkAuthCode(response.data);
      setVisible(true);
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
    if (authCode != chkAuthCode) {
      return Alert.alert('알림', '인증번호가 일치하지 않습니다.');
    }
    console.log(authCode, chkAuthCode);
    try {
      setLoadingA(true);
      Alert.alert('알림', '전화번호 인증이 완료되었습니다.');
      setVisible(false);
      setPasswordVisible(true);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
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
    if (newPassword !== chkPassword) {
      return Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(newPassword)
    ) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야 합니다.',
      );
    }
    console.log(newPassword);
    try {
      console.log('핸폰 번호: ', phoneNumber);
      setLoadingPw(true);
      const response = await axios.post(`${Config.API_URL}/auth/newPassword`, {
        phoneNumber,
        newPassword,
      });
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

  const canGoNextP = phoneNumber && buttonReady;
  const canGoNextA = authCode && authButtonReady;
  const canGoNextPw = newPassword && chkPassword;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>전화번호</Text>
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
        </View>
        <MyButton
          loading={loadingP}
          text="인증번호 발송"
          onPress={onSubmitPhoneNumber}
          canGoNext={canGoNextP}
          disabled={!canGoNextP || loadingP}
        />
        <Modal
          isVisible={visible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalWrapper}>
              <Text style={styles.modalWrapperText}>인증번호 입력</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.OtpArea}>
                <OTPTextView
                  containerStyle={styles.textInputContainer}
                  tintColor={'darkblue'}
                  offTintColor={'lightgray'}
                  handleTextChange={onChangeAuthCode}
                  textInputStyle={styles.roundedTextInput}
                  inputCount={4}
                />
              </View>
              <MyButton
                loading={loadingA}
                text="확인"
                onPress={onSubmitAuthCode}
                canGoNext={authButtonReady}
                disabled={!canGoNextA}
              />
            </View>
          </View>
        </Modal>
        {passwordVisible && (
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>비밀번호</Text>
              <MyTextInput
                placeholder="새로운 비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
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
              <MyTextInput
                placeholder="비밀번호를 한 번 더 입력해주세요."
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
              text="비밀번호 변경"
              onPress={onSubmitPassword}
              canGoNext={canGoNextPw}
              disabled={!canGoNextPw || loadingPw}
            />
          </View>
        )}
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  inputWrapper: {
    marginTop: 15,
    // backgroundColor: 'pink',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    // backgroundColor: 'yellow',
    fontFamily: Fonts.TRBold,
    fontSize: 19,
    color: 'black',
  },
  OtpArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingVertical: 10,
    marginTop: 15,
  },
  textInputContainer: {
    // marginBottom: 20,
    // color: 'darkblue',
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
    fontFamily: Fonts.TRBold,
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    /* 모달창 크기 조절 */
    width: 320,
    height: 220,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalWrapper: {
    flex: 1,
    width: 320,
    justifyContent: 'center',
  },
  modalWrapperText: {
    marginTop: 10,
    alignSelf: 'center',
    fontFamily: Fonts.TRRegular,
    fontSize: 25,
  },
});

export default NewPassword;
