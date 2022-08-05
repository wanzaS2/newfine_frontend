import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {Fonts} from '../assets/Fonts';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import RNPickerSelect from 'react-native-picker-select';
// import MyPickerSelect from '../components/MyPickerSelect';
// import Overlay from 'react-native-elements/dist/overlay/Overlay';

type SignUpAuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpAuth'
>;

function SignUpAuth({navigation}: SignUpAuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonReady, setButtonReady] = useState<boolean>(false);
  const [authButtonReady, setAuthButtonReady] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState('');
  const [chkAuthCode, setChkAuthCode] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const phoneNumberRef = useRef<TextInput | null>(null);
  const authCodeRef = useRef<TextInput | null>(null);
  const [branch, setBranch] = useState('');
  // const [b, setB] = useState('');
  const data = [
    {label: '대치', value: 1},
    {label: '반포', value: '반포'},
    {label: '압구정', value: '압구정'},
  ];

  const onChangeBranch = value => {
    console.log(value);
    setBranch(value);
  };

  const onChangePhoneNumber = useCallback(text => {
    setPhoneNumber(text.trim());
  }, []);
  const onChangeAuthCode = useCallback(text => {
    setAuthCode(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (phoneNumber.length < 11) {
      setButtonReady(false);
    } else {
      setButtonReady(true);
    }
    if (!branch) {
      return Alert.alert('알림', '분원을 선택해주세요.');
    }
    if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
      return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    }
    console.log(phoneNumber);
    console.log(branch);
    try {
      setVisible(true);
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/auth/sendMessage`, {
        phoneNumber,
        branch,
      });
      setChkAuthCode(response.data);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, phoneNumber]);

  const onChkAuthCode = useCallback(async () => {
    if (loading) {
      return;
    }
    if (authCode.length < 4) {
      setAuthButtonReady(false);
    } else {
      setAuthButtonReady(true);
    }
    if (authCode != chkAuthCode) {
      return Alert.alert('알림', '인증번호가 일치하지 않습니다.');
    }
    console.log(authCode, chkAuthCode);
    try {
      setLoading(true);
      Alert.alert('알림', '전화번호 인증이 완료되었습니다.');
      navigation.navigate('SignUp', {phoneNumber: phoneNumber});
    } catch (error) {
      // const errorResponse = (error as AxiosError).response;
      // console.error(errorResponse);
      // if (errorResponse) {
      //   Alert.alert('알림', errorResponse.data.message);
      // }
    } finally {
      setLoading(false);
    }
  }, [loading, authCode, chkAuthCode, navigation, phoneNumber]);

  const canGoNext = branch && phoneNumber && buttonReady;
  const canGoNextAuth = authCode && authButtonReady;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.TRBold, fontSize: 25}}>
            분원 선택
          </Text>
          {/*<MyPickerSelect*/}
          {/*  onValueChange={value => onChangeBranch(value)}*/}
          {/*  value={branch}*/}
          {/*  data={data}*/}
          {/*  placeholder={'분원을 선택해주세요.'}*/}
          {/*/>*/}
          <RNPickerSelect
            textInputProps={{underlineColorAndroid: 'transparent'}}
            fixAndroidTouchableBug={true} // 안드로이드 에러 방지
            useNativeAndroidPickerStyle={false} // 기본 안드로이드 textInput 스타일 X, pickerSelect 스타일 O
            placeholder={{label: '분원을 선택해주세요.'}}
            value={branch}
            onValueChange={value => onChangeBranch(value)}
            // items={[
            //   {label: '반포', value: '반포'},
            //   {label: '반포', value: '반포'},
            //   {label: '반포', value: '반포'},
            // ]}
            items={data}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.textArea}>
            <Text style={{fontFamily: Fonts.TRBold, fontSize: 25}}>
              전화번호를 입력해주세요.
            </Text>
            <Text
              style={{fontFamily: Fonts.TRRegular, fontSize: 18, marginTop: 3}}>
              전화번호를 아이디로 사용합니다.
            </Text>
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
            onSubmitEditing={onSubmit}
            blurOnSubmit={false}
          />
        </View>
        <MyButton
          loading={visible === true ? false : !true}
          text="인증번호 발송"
          onPress={() =>
            canGoNext && {
              onSubmit,
            }
          }
          canGoNext={buttonReady}
          disable={!canGoNext || loading}
        />
        {visible && (
          <View style={styles.inputWrapper}>
            <View style={styles.textArea}>
              <Text style={{fontFamily: Fonts.TRBold, fontSize: 25}}>
                인증번호를 입력해주세요.
              </Text>
            </View>
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
              onSubmitEditing={onChkAuthCode}
              blurOnSubmit={false}
            />
            <MyButton
              loading={loading}
              text="확인"
              onPress={onChkAuthCode}
              canGoNext={authButtonReady}
              disabled={!canGoNextAuth}
            />
          </View>
        )}
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  textArea: {
    padding: 10,
    marginTop: '15%',
    justifyContent: 'center',
    marginBottom: 5,
  },
  inputWrapper: {
    // paddingTop: 20,
    padding: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    height: 50,
    width: 300,
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  inputAndroid: {
    fontSize: 16,
    height: 50,
    width: 300,
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
});

export default SignUpAuth;
