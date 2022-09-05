import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
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
import {RootState} from '../../store/reducer';
import {useAppDispatch} from '../../store';
import userSlice from '../../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import MyTextInput from '../../components/MyTextInput';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Fonts} from '../../assets/Fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MyButton from '../../components/MyButton';
import {Actionsheet, Box, useDisclose} from 'native-base';

function MyPage() {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const originalNickname = useSelector(
    (state: RootState) => state.user.nickname,
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [visibleNicknameInput, setVisibleNicknameInput] =
    useState<boolean>(false);
  const [visiblePwInput, setVisiblePwInput] = useState<boolean>(false);
  const nicknameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const photoUrl = useSelector((state: RootState) => state.user.photoURL);
  const [changeImage, setChangeImage] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclose();

  const onResponse = useCallback(response => {
    console.log(response.width, response.height, response.exif);
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path,
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    )
      .then(r => {
        console.log(r.uri, r.name);
        setImage({
          uri: r.uri,
          name: r.name,
          type: response.mime,
        });
        console.log('이미지-: ', image);
      })
      .then(() => {
        console.log('이미지 업로드 ㄱ-ㄱ-ㄱ-ㄱ-ㄱ-ㄱ-ㄱ-: ', image);
      });
    // .then(() => {
    //   onUpdateImage();
    // });
  }, []);

  useEffect(() => {
    console.log('되어라 쫌: ', image);
    onUpdateImage();
  }, [image]);

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
    console.log(image);
    if (!image) {
      // if (photoUrl) {
      return (
        <View style={styles.imageWrapper}>
          <Pressable
            onPress={onOpen}
            style={{
              // backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!photoUrl ? (
              <View
                style={{
                  backgroundColor: 'darkgray',
                  width: 150,
                  height: 150,
                  borderRadius: 16,
                  borderColor: '#e0f2fe',
                  borderWidth: 4,
                }}
              />
            ) : (
              <Image
                source={{uri: photoUrl}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 16,
                  borderColor: '#e0f2fe',
                  borderWidth: 4,
                }}
              />
            )}
            <FontAwesome5Icon
              name={'camera'}
              size={50}
              color={'lightgray'}
              style={{position: 'absolute'}}
            />
          </Pressable>
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Actionsheet.Item
                onPress={onChangeFile}
                startIcon={
                  <FontAwesome5Icon name={'poo'} size={22} color={'black'} />
                }>
                새로운 사진 선택
              </Actionsheet.Item>
              <Actionsheet.Item
                onPress={removeImage}
                // style={{backgroundColor: 'yellow'}}
                startIcon={
                  <FontAwesome5Icon name={'times'} size={22} color={'black'} />
                }>
                현재 사진 삭제
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </View>
      );
    } else {
      // 새로 선택한 이미지 O
      return (
        <View style={styles.imageWrapper}>
          <Pressable
            onPress={onOpen}
            style={{
              // backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: image.uri}}
              style={{
                width: 150,
                height: 150,
                borderRadius: 16,
                borderColor: '#e0f2fe',
                borderWidth: 4,
              }}
            />
            {/*<FontAwesome5Icon*/}
            {/*  name={'camera'}*/}
            {/*  size={50}*/}
            {/*  color={'lightgray'}*/}
            {/*  style={{position: 'absolute'}}*/}
            {/*/>*/}
          </Pressable>
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Actionsheet.Item
                onPress={onChangeFile}
                startIcon={
                  <FontAwesome5Icon name={'poo'} size={22} color={'black'} />
                }>
                새로운 사진 선택
              </Actionsheet.Item>
              <Actionsheet.Item
                onPress={removeImage}
                // style={{backgroundColor: 'yellow'}}
                startIcon={
                  <FontAwesome5Icon name={'times'} size={22} color={'black'} />
                }>
                현재 사진 삭제
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </View>
      );
    }
  };

  const onUpdateImage = useCallback(async () => {
    if (!image) {
      // return Alert.alert('알림', '이미지를 선택해주세요.');
      return;
    }
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
    if (loadingUpdate) {
      return;
    }
    if (!nickname || !nickname.trim()) {
      return Alert.alert('알림', '변경할 닉네임을 입력해주세요.');
    }
    try {
      setLoadingUpdate(true);
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
      Alert.alert('알림', '닉네임 변경 완료되었습니다!');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoadingUpdate(false);
    }
  }, [loadingUpdate, nickname, accessToken, dispatch]);

  const deleteMember = () => {
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
    if (loadingDelete) {
      return;
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoadingDelete(true);
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
      Alert.alert('알림', '탈퇴 완료되었습니다..');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoadingDelete(false);
    }
  }, [loadingDelete, password, accessToken, dispatch]);

  const onLogout = useCallback(async () => {
    try {
      console.log(accessToken);
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      const response = await axios.post(
        `${Config.API_URL}/auth/logout`,
        {accessToken, refreshToken},
        // ********  나중에 토큰 필요하게 변경??
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

  const canGoDelete = password;
  const canGoUpdateNickname = nickname;
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.titleArea}>
          <Text style={styles.textArea}>
            <Text style={{color: 'darkblue'}}>{originalNickname}</Text>
            <Text style={{color: 'black'}}>의 페이지</Text>
          </Text>
        </View>
        <View style={styles.inputWrapper}>
          <View style={{alignItems: 'center'}}>{showImage()}</View>
          {/*<Pressable onPress={onUpdateImage} style={styles.button}>*/}
          {/*  <View style={{alignItems: 'center'}}>*/}
          {/*    <Text*/}
          {/*      style={{*/}
          {/*        color: 'black',*/}
          {/*        fontFamily: Fonts.TRBold,*/}
          {/*        fontSize: 19,*/}
          {/*      }}>*/}
          {/*      사진 변경*/}
          {/*    </Text>*/}
          {/*  </View>*/}
          {/*</Pressable>*/}
        </View>
        <View style={styles.inputWrapper}>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (visibleNicknameInput === true) {
                setVisibleNicknameInput(false);
              } else {
                setVisibleNicknameInput(true);
              }
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: Fonts.TRBold,
                  fontSize: 19,
                }}>
                닉네임 변경 <FontAwesome5Icon name={'angle-down'} size={17} />
              </Text>
            </View>
          </Pressable>
          {visibleNicknameInput && (
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
              <MyButton
                loading={loadingUpdate}
                text="변경"
                onPress={onSubmitNickname}
                canGoNext={canGoUpdateNickname}
                disabled={!canGoUpdateNickname || loadingUpdate}
              />
            </View>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (visiblePwInput === true) {
                setVisiblePwInput(false);
              } else {
                setVisiblePwInput(true);
              }
            }}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: 'gray',
                  fontFamily: Fonts.TRBold,
                  fontSize: 19,
                }}>
                회원 탈퇴 <FontAwesome5Icon name={'angle-down'} size={17} />
              </Text>
            </View>
          </Pressable>
          {visiblePwInput && (
            <View>
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
              <MyButton
                loading={loadingDelete}
                text="탈퇴하기"
                onPress={deleteMember}
                canGoNext={canGoDelete}
                disabled={!canGoDelete || loadingDelete}
              />
            </View>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Pressable onPress={onLogout} style={styles.button}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: 'red',
                  fontFamily: Fonts.TRBold,
                  fontSize: 19,
                }}>
                logout
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={{marginBottom: 30}} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  titleArea: {
    paddingTop: '10%',
    padding: '3%',
    // backgroundColor: 'yellow',
    alignItems: 'center',
  },
  imageWrapper: {
    // paddingTop: '2%',
    paddingBottom: 20,
    // backgroundColor: 'blue',
  },
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor: 'yellowgreen',
  },
  textArea: {
    fontFamily: Fonts.TRBold,
    fontSize: 25,
  },
  button: {
    backgroundColor: '#bae6fd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
export default MyPage;
