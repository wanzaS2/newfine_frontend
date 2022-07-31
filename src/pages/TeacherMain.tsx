import React, {useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import Title from '../components/Title';
import TeacherCourse from './TeacherCourse';
function TeacherMain({navigation}) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const name = useSelector((state: RootState) => state.user.name);
  const dispatch = useAppDispatch();
  const teacher = name + ' Teacher';
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
    <View style={styles.container}>
      <Title title={teacher} />
      <TouchableOpacity onPress={() => navigation.navigate('TeacherCourse')}>
        <View style={styles.box}>
          <Text style={styles.font}>내 수업</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Attendance')}>
        <View style={styles.box}>
          <Text style={styles.font}>현재 랭킹</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.box}>
          <Text style={styles.font}>내 정보</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout}>
        <View style={styles.box}>
          <Text style={styles.font}>로그아웃</Text>
        </View>
      </TouchableOpacity>
    </View>
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

export default TeacherMain;
