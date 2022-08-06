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
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {Fonts} from '../assets/Fonts';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import RNPickerSelect from 'react-native-picker-select';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
// import MyPickerSelect from '../components/MyPickerSelect';
// import Overlay from 'react-native-elements/dist/overlay/Overlay';

type SignUpAuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpAuth'
>;

function VideoAuth({navigation}: SignUpAuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonReady, setButtonReady] = useState<boolean>(false);
  const [authButtonReady, setAuthButtonReady] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState('');
  const [chkAuthCode, setChkAuthCode] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const phoneNumberRef = useRef<TextInput | null>(null);
  const authCodeRef = useRef<TextInput | null>(null);
  // const [b, setB] = useState('');
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
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
    if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
      return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    }
    console.log(phoneNumber);
    try {
      setVisible(true);
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
      navigation.navigate('ApplyVideo', {phoneNumber: phoneNumber});
    } catch (error) {
      // }
    } finally {
      setLoading(false);
    }
  }, [loading, authCode, chkAuthCode, navigation, phoneNumber]);
  const canGoNext = phoneNumber && buttonReady;
  const canGoNextAuth = authCode && authButtonReady;
  useEffect(() => {
    getPhoneNumber();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <View style={styles.textArea}>
            <Text style={{fontFamily: Fonts.TRBold, fontSize: 25}}>
              부모님 인증이 필요합니다.
            </Text>
            <Text
              style={{fontFamily: Fonts.TRRegular, fontSize: 18, marginTop: 3}}>
              저장된 부모님 번호입니다.인증번호 발송 버튼을 눌러주세요!
            </Text>
          </View>
          <MyTextInput
            // onChangeText={onChangePhoneNumber}
            placeholder="부모님번호"
            placeholderTextColor="#666"
            maxLength={11}
            textContentType="telephoneNumber"
            // keyboardType={'number-pad'}
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
  container: {flex: 1, backgroundColor: 'white'},
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

export default VideoAuth;
