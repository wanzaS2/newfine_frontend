import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../AppInner';
import MyTextInput from './MyTextInput';
import MyButton from './MyButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {LoggedInParamList} from '../../AppInner';
import {RootState} from '../store/reducer';
import {useSelector} from 'react-redux';
import {Fonts} from '../assets/Fonts';
import EncryptedStorage from 'react-native-encrypted-storage';
import extractPathFromURL from '@react-navigation/native/lib/typescript/src/extractPathFromURL';

const screenWidth = Dimensions.get('window').width;

function SetUpProfile() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  console.log('프로필 액토 셀렉터', accessToken);
  const phoneNumber = useSelector((state: RootState) => state.user.phoneNumber);

  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const nicknameRef = useRef<TextInput | null>(null);
  // const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  // const [image, setImage] = useState('');
  const [changedImage, setChangedImage] = useState(''); //S3에 의해 변환된 후의 주소

  const onChangeNickname = useCallback(text => {
    setNickname(text.trim());
  }, []);

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
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

  const showImage = () => {
    if (!image) {
      return (
        <View
          style={{
            // width: screenWidth,
            // height: screenWidth,
            width: 250,
            height: 250,
            backgroundColor: '#eeeeee',
            borderRadius: 125,
            borderColor: 'skyblue',
            borderWidth: 5,
          }}
        />
      );
    } else {
      console.log(image);
      return (
        <View>
          <Image
            source={{uri: image.uri}}
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              borderColor: 'skyblue',
              borderWidth: 5,
            }}
          />
          <Pressable
            style={{
              position: 'absolute',
              right: 0,
            }}
            onPress={() => {
              removeImage();
            }}>
            <Image
              source={require('../assets/images/delete.png')}
              style={{width: 30, height: 30}}
            />
          </Pressable>
        </View>
      );
    }
  };

  // const chooseImage = async () => {
  //   // if (image === '') {
  //   //   ImagePicker.openPicker({
  //   //     width: screenWidth,
  //   //     height: screenWidth,
  //   //     cropping: true,
  //   //     waitAnimationEnd: false,
  //   //     includeExif: true,
  //   //     forceJpg: true, //ios live photo를 jpg로 바꿔줌
  //   //     compressImageQuality: 1, //이미지 압축 0~1
  //   //     mediaType: 'photo',
  //   //     includeBase64: true,
  //   //   })
  //   //     .then(async image => {
  //   //       try {
  //   //         console.log(image);
  //   //         const myImage = {
  //   //           name: phoneNumber,
  //   //           type: 'image/jpeg',
  //   //           uri: image.path,
  //   //         };
  //   //         const response = await uploadPhoto({myImage: myImage});
  //   //         console.log(response);
  //   //       } catch (error) {
  //   //         const errorResponse = (error as AxiosError).response;
  //   //         if (errorResponse) {
  //   //           Alert.alert('알림', errorResponse.data.message);
  //   //         }
  //   //       }
  //
  //   if (image === '') {
  //     try {
  //       const response = await ImagePicker.openPicker({
  //         width: screenWidth,
  //         height: screenWidth,
  //         cropping: true,
  //         waitAnimationEnd: false,
  //         includeExif: true,
  //         forceJpg: true, //ios live photo를 jpg로 바꿔줌
  //         compressImageQuality: 1, //이미지 압축 0~1
  //         mediaType: 'photo',
  //         includeBase64: true,
  //       });
  //       console.log('갤러리 선택한 이미지 결과: ', response);
  //       setImage(response);
  //       console.log('Image(이미지 스테이트 저장): ', image);
  //     } catch (error) {
  //       console.log(error.code, error.message);
  //     }
  //
  //     // ImagePicker.openPicker({
  //     //   width: screenWidth,
  //     //   height: screenWidth,
  //     //   cropping: true,
  //     //   waitAnimationEnd: false,
  //     //   includeExif: true,
  //     //   forceJpg: true, //ios live photo를 jpg로 바꿔줌
  //     //   compressImageQuality: 1, //이미지 압축 0~1
  //     //   mediaType: 'photo',
  //     //   includeBase64: true,
  //     // })
  //     //   .then(responseImage => {
  //     //     console.log('갤러리에서 선택한 사진: ', responseImage);
  //     //     setImage(responseImage);
  //     //     dispatch(
  //     //       userSlice.actions.setPhotoURL({
  //     //         photoURL: responseImage,
  //     //       }),
  //     //     );
  //     //   })
  //     //   .catch(e => console.log('Error: ', e.message));
  //   } else {
  //     Alert.alert('이미 사진이 존재합니다.');
  //   }
  // };

  const removeImage = async () => {
    setImage(undefined);

    // console.log('이미지 삭제', accessToken);
    // const response = await axios.post(
    //   `${Config.API_URL}/image/delete?image=${changedImage}`,
    //   {},
    //   {headers: {Authorization: `Bearer ${accessToken}`}},
    // );
    // console.log(response.data);
    // if (response.data.message === 'success') {
    //   dispatch(
    //     userSlice.actions.setPhotoURL({
    //       photoURL: '',
    //     }),
    //   );
    // }
    //   fetch(`${Config.API_URL}/image/delete?images=${changedImage}`, {
    //     method: 'POST',
    //     headers: {
    //       token: accessToken,
    //     },
    //   })
    //     .then(response => response.json())
    //     .then(json => {
    //       console.log(json);
    //       dispatch(
    //         userSlice.actions.setPhotoURL({
    //           photoURL: '',
    //         }),
    //       );
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
  };

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

  // const uploadPhoto = async () => {
  //   const formData = new FormData();
  //   formData.append('image', {
  //     name: phoneNumber,
  //     type: 'image/jpeg',
  //     uri: image.path,
  //   });
  //   console.log('업로드 폼데이터: ', formData);
  //
  //   const response = await axios.post(
  //     '${Config.API_URL}/image/upload',
  //     {formData},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     },
  //   );
  //   console.log(response.data);
  //   console.log(response);
  //   if (response.data.message === true) {
  //     setChangedImage(response.data);
  //   }
  //   dispatch(
  //     userSlice.actions.setPhotoURL({
  //       response,
  //     }),
  //   );
  // };

  // const uploadPhoto = async () => {
  //   const formData = new FormData();
  //   formData.append('image', {
  //     name: 'name',
  //     type: 'image/jpeg',
  //     uri: image.path,
  //   });

  // console.log(formData);
  //
  //   const response = await axios.post(
  //     '${Config.API_URL}/image/upload',
  //     {formData},
  //     {headers: {Authorization: `Bearer ${accessToken}`}},
  //   );
  //   console.log(response.data);
  //   if (response.data.message === true) {
  //     setChangedImage(response.data);
  //   }
  //   dispatch(
  //     userSlice.actions.setPhotoURL({
  //       photoURL: response.data,
  //     }),
  //   );
  //
  //   // fetch('${Config.API_URL}/image/upload', {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     token: accessToken,
  //   //   },
  //   //   body: formData,
  //   // })
  //   //   .then(response => response.json())
  //   //   .then(json => {
  //   //     console.log('upload api : ', json);
  //   //     console.log(json.data);
  //   //     if (json.success === true) {
  //   //       setChangedImage(json.data);
  //   //     }
  //   //     dispatch(
  //   //       userSlice.actions.setPhotoURL({
  //   //         photoURL: json.data,
  //   //       }),
  //   //     );
  //   //   })
  //   //   .catch(e => {
  //   //     console.log(e);
  //   //   });
  // };

  const onComplete = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!nickname || !nickname.trim()) {
      return Alert.alert('알림', '닉네임을 꼭 입력해주세요.');
    }
    // if (!nickname) {
    //   Alert.alert('알림', '닉네임을 꼭 입력해주세요.');
    //   return;
    // }
    if (image) {
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
        console.log('사진 저장??: ', response.data);
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
    }

    // const formData = new FormData();
    // formData.append('image', image);
    // try {
    //   await axios.post(`${Config.API_URL}/image/upload`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    //   Alert.alert('알림', '완료처리 되었습니다.');
    //   navigation.navigate('Main');
    // } catch (error) {
    //   const errorResponse = (error as AxiosError).response;
    //   if (errorResponse) {
    //     Alert.alert('알림', errorResponse.data.message);
    //   }
    // }
    try {
      setLoading(true);
      const response = await axios.post(
        `${Config.API_URL}/member/nickname`,
        {
          nickname,
          phoneNumber,
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
      Alert.alert('알림', '환영합니다!!');
      navigation.navigate('Main');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    nickname,
    image,
    accessToken,
    dispatch,
    phoneNumber,
    navigation,
  ]);

  // const onSubmit = useCallback(async () => {
  //   if (loading) {
  //     return;
  //   }
  //   if (!nickname || !nickname.trim()) {
  //     return Alert.alert('알림', '닉네임을 입력해주세요.');
  //   }
  //
  //   // ********************* 프사 관련? ********************* //
  //   // let photoURL = null;
  //   // if (photo) {
  //   //   const asset = photo.assets[0];
  //   //   const extension = asset.fileName.split('.').pop(); // 확장자 추출
  //   //   const reference = storage().ref(`/profile/${uid}.${extension}`);
  //   //
  //   //   if (Platform.OS === 'android') {
  //   //     await reference.putString(asset.base64, 'base64', {
  //   //       contentType: asset.type,
  //   //     });
  //   //   } else {
  //   //     await reference.putFile(asset.uri);
  //   //   }
  //   //
  //   //   photoURL = response ? await reference.getDownloadURL() : null;
  //   // }
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`${Config.API_URL}/member/nickname`, {
  //       nickname,
  //     });
  //     console.log(response.data);
  //     Alert.alert('알림', '환영합니다!!');
  //     navigation.navigate('Main');
  //     dispatch(
  //       userSlice.actions.setProfile({
  //         nickname: response.data.nickname,
  //       }),
  //     );
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError).response;
  //     if (errorResponse) {
  //       Alert.alert('알림', errorResponse.data.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [dispatch, loading, navigation, nickname]);

  // const onTakePhoto = useCallback(() => {
  //   return ImagePicker.openCamera({
  //     includeBase64: true,
  //     includeExif: true,
  //     saveToPhotos: true,
  //   })
  //     .then(onResponse)
  //     .catch(console.log);
  // }, [onResponse]);

  // const onSelectImage = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       maxWidth: 512,
  //       maxHeight: 512,
  //       includeBase64: Platform.OS === 'android',
  //     },
  //     res => {
  //       // if (res.didCancel) {
  //       //   // 취소했을 경우
  //       //   return;
  //       // }
  //       console.log(res);
  //       setPhoto(res);
  //     },
  //   );
  // };

  // useEffect(() => {
  //   if (image !== '') {
  //     uploadPhoto({});
  //   }
  // }, [image]);

  const canGoNext = nickname;
  return (
    <View style={styles.block}>
      {showImage()}
      {/*<Pressable onPress={onSelectImage}>*/}
      {/*  <Image*/}
      {/*    style={styles.circle}*/}
      {/*    source={require('../assets/images/removePhoto.png')}*/}
      {/*  />*/}
      {/*</Pressable>*/}
      {/*<Pressable>*/}
      {/*  <Text>사진 촬영</Text>*/}
      {/*</Pressable>*/}
      <Pressable style={styles.selectPhoto} onPress={onChangeFile}>
        {/*onPress={() => {*/}
        {/*  chooseImage();*/}
        {/*}}>*/}
        <Text
          style={{
            fontFamily: Fonts.TRRegular,
            fontWeight: 'bold',
            color: 'white',
            fontSize: 16,
          }}>
          사진 선택
        </Text>
      </Pressable>
      <View style={styles.inputWrapper}>
        <MyTextInput
          placeholder="닉네임을을 입력해주세요"
          placeholderTextColor="#666"
          onChangeText={onChangeNickname}
          value={nickname}
          textContentType="nickname"
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={nicknameRef}
          onSubmitEditing={onComplete}
          blurOnSubmit={false}
        />
        <MyButton
          loading={loading}
          text="다음"
          // onPress={onSubmit}
          onPress={onComplete}
          canGoNext={canGoNext}
          disable={!canGoNext || loading}
          disable={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    // backgroundColor: 'green',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  circle: {
    backgroundColor: 'skyblue',
    borderRadius: 64,
    width: 128,
    height: 128,
    borderColor: 'skyblue',
    borderWidth: 5,
  },
  selectPhoto: {
    backgroundColor: 'darkblue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  inputWrapper: {
    marginTop: 16,
    width: '100%',
  },
});
export default SetUpProfile;
