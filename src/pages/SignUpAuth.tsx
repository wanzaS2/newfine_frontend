import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
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

type SignUpAuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpAuth'
>;

function SignUpAuth({navigation}: SignUpAuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [phonenumber, setPhonenumber] = useState('');
  const phonenumberRef = useRef<TextInput | null>(null);

  const onChangePhonenumber = useCallback(text => {
    setPhonenumber(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!phonenumber || !phonenumber.trim()) {
      return Alert.alert('알림', '전화번호를 입력해주세요.');
    }
    console.log(phonenumber);
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/auth/signup0`, {
        phonenumber,
      });
      console.log(response.data);
      // Alert.alert('알림', '회원가입 되었습니다.');
      navigation.navigate('SignUp');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, navigation, phonenumber]);

  const canGoNext = phonenumber;
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>전화번호를 입력해주세용~!</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangePhonenumber}
            placeholder="전화번호를 입력해주세요"
            placeholderTextColor="#666"
            maxLength={11}
            textContentType="telephoneNumber"
            keyboardType={'number-pad'}
            value={phonenumber}
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={phonenumberRef}
            // onSubmitEditing={() => nicknameRef.current?.focus()}
            onSubmitEditing={onSubmit}
            blurOnSubmit={false}
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
              <Text style={styles.loginButtonText}>다음</Text>
            )}
          </Pressable>
        </View>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
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
export default SignUpAuth;
