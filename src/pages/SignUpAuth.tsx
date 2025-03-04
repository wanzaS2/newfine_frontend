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
import OTPTextView from 'react-native-otp-textinput';
import {CheckIcon, Select} from 'native-base';
import {width, height} from '../config/globalStyles';

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
  const [branch, setBranch] = useState('');
  const [branchList, setBranchList] = useState();
  const [branchListLength, setBranchListLength] = useState();

  const getBranch = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/branch/getBranchList`,
        {},
      );
      console.log('set 전: ', response.data);
      setBranchList(response.data);
      setBranchListLength(response.data.length);
      console.log('set 후: ', branchList);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  };

  useEffect(() => {
    getBranch();
    console.log('\n\n\n\nbranchList : ', branchList);
    // console.log('branchList : ', branchList[0].branchName);
    console.log('branchListLength : ', branchListLength);
  }, [branchListLength]);

  const onChangeBranch = value => {
    console.log(value);
    setBranch(value);
    console.log('브랜치: ', branch);
  };

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

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    console.log('branch:   ', branch);
    console.log('!branch:   ', branch === '');
    if (branch === '') {
      return Alert.alert('알림', '분원을 선택해주세요.');
    }
    if (!/^[0-9].{0,11}$/.test(phoneNumber)) {
      return Alert.alert('알림', '하이픈 없이 11자리 전화번호를 입력해주세요.');
    }
    console.log(phoneNumber);
    console.log(branch);
    try {
      setLoading(true);
      const response = await axios.post(
        `${Config.API_URL}/auth/sendSignUpMessage`,
        {
          phoneNumber,
          branch,
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
  }, [loading, branch, phoneNumber]);

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

  const canGoAuthCode = branch && phoneNumber && buttonReady;
  const canGoNext = authCode && authButtonReady;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.branchArea}>
          <Text
            style={{fontFamily: Fonts.TRBold, fontSize: 23, color: 'black', paddingVertical: width * 5}}>
            분원을 선택해주세요.
          </Text>
          <Select
            selectedValue={branch}
            minWidth="200"
            accessibilityLabel="Choose Your Branch"
            placeholder="Choose Your Branch"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={itemValue => onChangeBranch(itemValue)}>
            {branchList &&
              branchList.map((content, i) => {
                console.log(branch);
                console.log(content);
                return <Select.Item label={content.branchName} value={i + 1} />;
              })}
          </Select>
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.textArea}>
            <Text
              style={{fontFamily: Fonts.TRBold, fontSize: 23, color: 'black', paddingVertical: width * 5}}>
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
          // loading={visible === true ? false : true}
          loading={loading}
          text="인증번호 발송"
          onPress={onSubmit}
          canGoNext={canGoAuthCode}
          disabled={!canGoAuthCode || loading}
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
              disabled={!canGoNext}
            />
          </View>
        )}
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  branchArea: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingVertical: width * 20,
    marginTop: width * 20,
  },
  inputWrapper: {
    paddingVertical: width * 10,
    paddingHorizontal: width * 20,
    // backgroundColor: 'yellow',
  },
  textArea: {
    justifyContent: 'center',
    marginBottom: width * 5,
    // backgroundColor: 'green',
  },
  OtpArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingVertical: width * 10,
    marginTop: width * 15,
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

export default SignUpAuth;
