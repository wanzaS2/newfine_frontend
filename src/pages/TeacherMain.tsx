import React, {useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';

function TeacherMain() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const name = useSelector((state: RootState) => state.user.name);
  const dispatch = useAppDispatch();

  const onLogout = useCallback(async () => {
    try {
      console.log(accessToken);
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      const response = await axios.post(
        `${Config.API_URL}/auth/logout`,
        {accessToken, refreshToken},
        // {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // },
      );
      console.log(response.data);
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setTeacher({
          phoneNumber: '',
          name: '',
          authority: '',
        }),
      );
      dispatch(
        userSlice.actions.setAccessToken({
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('accessToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error('에러ㅓㅓㅓㅓㅓㅓㅓ: ', errorResponse);
    }
  }, [accessToken, dispatch]);

  return (
    <SafeAreaView>
      <View style={styles.inputWrapper}>
        <Text>선생님메인</Text>
      </View>
      <View style={styles.inputWrapper}>
        <Text>{name}님 안녕하세용</Text>
      </View>
      <View style={styles.inputWrapper}>
        <Pressable onPress={onLogout}>
          <View style={{alignItems: 'center'}}>
            <Text>logout</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingTop: 20,
    padding: 10,
    alignItems: 'center',
  },
});

export default TeacherMain;
