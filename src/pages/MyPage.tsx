import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import MyTextInput from '../components/MyTextInput';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

function MyPage({navigation}) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();

  const [nickname, setNickname] = useState('');
  const nicknameRef = useRef<TextInput | null>(null);

  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput | null>(null);

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const photoUrl = useSelector((state: RootState) => state.user.photoURL);
  const [changeImage, setChangeImage] = useState(false);
  const deviceToken = useSelector((state: RootState) => state.user.deviceToken);

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    // const orientation = (response.exif as any)?.Orientation;
    // console.log('orientation', orientation);
    setChangeImage(true);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      cropping: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  // const urlToBase64 = () => {
  //   const res=axios.get(`${photoUrl}`);
  //   const imagePath=res.path();
  //   RNFS.readFile(photoUrl, 'base64')
  //     .then(response => {
  //       console.log(response);
  //     })
  //     .then(onResponse);
  // };

  const removeImage = async () => {
    setImage(undefined);

    const p = photoUrl.substring(62);
    console.log(p);

    const response = await axios.post(
      `${Config.API_URL}/image/delete?image=${p}`,
      {},
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    console.log(response.data);
    if (response.data.message === 'success') {
      dispatch(
        userSlice.actions.setPhotoURL({
          photoURL: '',
        }),
      );
      setImage(undefined);
    }
  };

  const showImage = () => {
    console.log(accessToken);
    console.log('으악');
    console.log('이미지: ', image);
    console.log('포토 유알엘: ', photoUrl);
    // if (photoUrl) {
    //   urlToBase64();
    // }
    console.log(image);
    if (!image) {
      return (
        <View>
          <Pressable onPress={onChangeFile}>
            <Image
              source={{uri: photoUrl}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                borderColor: 'skyblue',
                borderWidth: 5,
              }}
            />
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              right: 0,
              backgroundColor: 'pink',
            }}
            onPress={() => {
              removeImage();
            }}>
            <Image
              source={require('../assets/images/delete.png')}
              style={{width: 15, height: 15}}
            />
          </Pressable>
        </View>
      );
    } else {
      return (
        <View>
          <Pressable onPress={onChangeFile}>
            <Image
              source={{uri: image.uri}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                borderColor: 'skyblue',
                borderWidth: 5,
              }}
            />
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              right: 0,
            }}
            onPress={() => {
              removeImage();
            }}
          />
          <Image
            source={require('../assets/images/delete.png')}
            style={{width: 15, height: 15}}
          />
        </View>
      );
    }
  };

  const onUpdateImage = useCallback(async () => {
    const formData = new FormData();
    formData.append('image', image);
    console.log('폼데이터: ', formData);
    try {
      const response = await axios.post(
        `${Config.API_URL}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('프사 업뎃: ', response.data);
      dispatch(
        userSlice.actions.setPhotoURL({
          photoURL: response.data.data,
        }),
      );
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [image, accessToken, dispatch]);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onChangeNickname = useCallback(text => {
    setNickname(text.trim());
  }, []);

  const onSubmitNickname = useCallback(async () => {
    if (!nickname || !nickname.trim()) {
      return Alert.alert('알림', '변경할 닉넴 입력해주세요.');
    }
    try {
      const response = await axios.post(
        `${Config.API_URL}/member/nickname/update`,
        {
          nickname,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(
        userSlice.actions.setProfile({
          nickname: response.data.nickname,
        }),
      );
      console.log(response.data);
      Alert.alert('알림', '닉넴 변경 완');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [nickname, accessToken, dispatch, navigation]);

  const deletee = () => {
    Alert.alert(
      '알림',
      '정말로 탈퇴하시겠습니까?',
      [
        {text: '취소', onPress: () => {}, style: 'cancel'},
        {
          text: '탈퇴',
          onPress: () => {
            onSubmitPassword();
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  };

  const onSubmitPassword = useCallback(async () => {
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      const response = await axios.delete(`${Config.API_URL}/member/delete`, {
        data: {password},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(
        userSlice.actions.setUser({
          phoneNumber: '',
          nickname: '',
          photoURL: '',
        }),
      );
      dispatch(
        userSlice.actions.setAccessToken({
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
      await EncryptedStorage.removeItem('accessToken');
      console.log(response.data);
      Alert.alert('알림', '안녕히 가세요 ㅜㅜ');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [password, accessToken, dispatch]);

  const onLogout = useCallback(async () => {
    try {
      console.log(accessToken);
      console.log('deviceToken1:', deviceToken);
      // let phoneToken = '초기화';
      console.log('deviceToken2:');
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
        userSlice.actions.setUser({
          phoneNumber: '',
          nickname: '',
          photoURL: '',
        }),
      );
      dispatch(
        userSlice.actions.setAuthority({
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
      await EncryptedStorage.removeItem('authority');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error('에러ㅓㅓㅓㅓㅓㅓㅓ: ', errorResponse);
    }
  }, [accessToken, dispatch]);

  // onChangePhoto = useCallback(async () =>{
  //
  // });

  return (
    <SafeAreaView>
      <View style={styles.inputWrapper}>
        <Pressable onPress={onLogout}>
          <View style={{alignItems: 'center'}}>
            <Text>logout</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <Pressable>
          <View style={{alignItems: 'center'}}>
            <Text>비밀번호 찾기</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <MyTextInput
          placeholder="비밀번호를 입력해주세요 (영문, 숫자, 특수문자)"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          onChangeText={onChangePassword}
          value={password}
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmitPassword}
        />
        <Pressable
          onPress={() => {
            deletee();
          }}>
          <View style={{alignItems: 'center'}}>
            <Text>회원 탈퇴</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <View style={{alignItems: 'center'}}>{showImage()}</View>
        <Pressable onPress={onUpdateImage}>
          <View style={{alignItems: 'center'}}>
            <Text>프사 변경 or 삭제</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <View>
          <MyTextInput
            placeholder="닉네임을을 입력해주세요"
            placeholderTextColor="#666"
            onChangeText={onChangeNickname}
            value={nickname}
            textContentType="nickname"
            returnKeyType="send"
            clearButtonMode="while-editing"
            ref={nicknameRef}
            onSubmitEditing={onSubmitNickname}
            blurOnSubmit={false}
          />
        </View>
        <Pressable>
          <View style={{alignItems: 'center'}}>
            <Text>닉네임 변경</Text>
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
  },
});
export default MyPage;
