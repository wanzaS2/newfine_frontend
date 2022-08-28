import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import {Fonts} from '../../assets/Fonts';
import MyButton from '../../components/MyButton';
import MyTextInput from '../../components/MyTextInput';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import OTPTextView from 'react-native-otp-textinput';

type VideoAuthScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'VideoAuth'
>;

function VideoAuth({route, navigation}: VideoAuthScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authButtonReady, setAuthButtonReady] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState('');
  const [chkAuthCode, setChkAuthCode] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const phoneNumberRef = useRef<TextInput | null>(null);
  // const authCodeRef = useRef<TextInput | null>(null);

  console.log('페이지 변수', route.params);
  useEffect(() => {
    getPhoneNumber();
  }, []);
  const getPhoneNumber = () => {
    axios(`${Config.API_URL}/number/parents`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        setPhoneNumber(response.data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };
  const onChangeAuthCode = useCallback(text => {
    setAuthCode(text.trim());
    if (text.length < 4) {
      setAuthButtonReady(false);
    } else if (text.length === 4) {
      setAuthButtonReady(true);
    }
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    console.log('폰번호', phoneNumber);
    if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
      return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    }
    console.log(phoneNumber);
    try {
      setLoading(true);
      const response = await axios.post(
        `${Config.API_URL}/sendMessage/parents`,
        {
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setChkAuthCode(response.data);
      setVisible(true);
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
    if (authCode != chkAuthCode) {
      return Alert.alert('알림', '인증번호가 일치하지 않습니다.');
    }
    console.log(authCode, chkAuthCode);
    try {
      setLoading(true);
      Alert.alert('알림', '전화번호 인증이 완료되었습니다.');
      navigation.navigate('SignUp', {phoneNumber: phoneNumber});
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, authCode, chkAuthCode, navigation, phoneNumber]);

  const canGoNextAuth = authCode && authButtonReady;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <View style={styles.textArea}>
            <Text style={{fontFamily: Fonts.TRBold, fontSize: 25}}>
              학부모님 인증이 필요합니다.
            </Text>
            <Text
              style={{
                fontFamily: Fonts.TRRegular,
                fontSize: 18,
                marginTop: 3,
              }}>
              저장된 부모님 번호입니다.{'\n'}인증번호 발송 버튼을 눌러주세요!
            </Text>
          </View>
          <MyTextInput
            // onChangeText={onChangePhoneNumber}
            placeholder="부모님번호"
            placeholderTextColor="black"
            maxLength={11}
            textContentType="telephoneNumber"
            // keyboardType={'number-pad'}
            value={phoneNumber}
            returnKeyType="send"
            ref={phoneNumberRef}
            onSubmitEditing={onSubmit}
            blurOnSubmit={false}
            editable={false}
          />
        </View>
        <MyButton
          loading={loading}
          text="인증번호 발송"
          onPress={onSubmit}
          canGoNext={phoneNumber}
          disabled={!phoneNumber || loading}
        />
        {visible && (
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
  container: {flex: 1, backgroundColor: 'pin'},
  textArea: {
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: '15%',
  },
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

export default VideoAuth;
