import React, {useCallback, useRef, useState} from 'react';
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
import MyTextInput from './MyTextInput';
import MyButton from './MyButton';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;
type WelcomeScreenProps = NativeStackScreenProps<LoggedInParamList, 'Welcome'>;

function SetUpProfile({navigation}: WelcomeScreenProps) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const nicknameRef = useRef<TextInput | null>(null);
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();

  const onChangeNickname = useCallback(text => {
    setNickname(text.trim());
  }, []);

  const onResponse = useCallback(async response => {
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
        <View style={{alignItems: 'center'}}>
          <Ionicons name={'grin-stars'} size={250} color={'lightgray'} />
        </View>
      );
    } else {
      console.log(image);
      return (
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: image.uri}}
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
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
            <Icon name={'remove'} size={35} />
          </Pressable>
        </View>
      );
    }
  };

  const removeImage = async () => {
    setImage(undefined);
    console.log('프사 삭제');
  };

  const onChangeImage = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
      cropping: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onComplete = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!nickname || !nickname.trim()) {
      return Alert.alert('알림', '닉네임을 꼭 입력해주세요.');
    }
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
        console.log('프사 S3 response: ', response.data);
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
    try {
      setLoading(true);
      const response = await axios.post(
        `${Config.API_URL}/member/nickname`,
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
      Alert.alert('알림', '환영합니다!!');
      navigation.navigate('StudentMain');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, nickname, image, accessToken, dispatch, navigation]);

  const canGoNext = nickname;
  return (
    <View style={styles.container}>
      {showImage()}
      <View style={styles.buttonZone}>
        <Pressable style={styles.selectPhotoButton} onPress={onChangeImage}>
          <Text style={styles.selectPhotoButtonText}>사진 선택</Text>
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <MyTextInput
          placeholder="닉네임을을 입력해주세요."
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
          text="완료"
          onPress={onComplete}
          canGoNext={canGoNext}
          disabled={!canGoNext || loading}
        />
        {/*<Pressable*/}
        {/*  style={{alignItems: 'center'}}*/}
        {/*  onPress={onComplete}*/}
        {/*  disabled={!canGoNext || loading}>*/}
        {/*  {canGoNext ? (*/}
        {/*    <Icon name={'check-circle'} size={50} color={'darkblue'} />*/}
        {/*  ) : (*/}
        {/*    <Icon name={'check-circle'} size={50} />*/}
        {/*  )}*/}
        {/*</Pressable>*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'green',
    paddingVertical: 20,
    width: '100%',
  },
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 70,
    // backgroundColor: 'yellow',
  },
  buttonZone: {
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingVertical: 10,
  },
  selectPhotoButton: {
    backgroundColor: 'darkblue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  selectPhotoButtonText: {
    fontFamily: Fonts.TRBold,
    color: 'white',
    fontSize: 17,
  },
});
export default SetUpProfile;
