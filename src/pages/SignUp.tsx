import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Platform,
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
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import {RouteProp, useRoute} from '@react-navigation/native';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const route = useRoute<RouteProp<RootStackParamList>>(); // SignUpAuth 로부터 phoneNumber 넘겨받기 위해
  const phoneNumber = route.params?.phoneNumber;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [chkPassword, setChkPassword] = useState('');
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const chkPasswordRef = useRef<TextInput | null>(null);

  const onChangeName = useCallback(text => {
    setName(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onChangeChkPassword = useCallback(text => {
    setChkPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (!chkPassword || !chkPassword.trim()) {
      return Alert.alert('알림', '비밀번호 확인을 해주세요.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    if (password !== chkPassword) {
      return Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
    }
    console.log(name, password);
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/auth/signup`, {
        phoneNumber,
        name,
        password,
      });
      console.log('SignUp Response: ', response.data);
      Alert.alert('알림', '회원가입 완료!!');
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
  }, [loading, name, password, chkPassword, phoneNumber, navigation]);

  const canGoNext = phoneNumber && name && password && chkPassword;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>전화번호</Text>
          <MyTextInput
            placeholder={phoneNumber}
            placeholderTextColor="#666"
            value={phoneNumber}
            blurOnSubmit={false}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이름</Text>
          <MyTextInput
            onChangeText={onChangeName}
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#666"
            textContentType="none"
            value={name}
            keyboardType="default"
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={nameRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            // secureTextEntry={true}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <MyTextInput
            placeholder="비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
            placeholderTextColor="#666"
            onChangeText={onChangePassword}
            value={password}
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
            onSubmitEditing={onSubmit}
          />
        </View>
        <MyButton
          loading={loading}
          text="회원가입"
          onPress={onSubmit}
          canGoNext={canGoNext}
          disabled={!canGoNext || loading}
        />
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
});

export default SignUp;
