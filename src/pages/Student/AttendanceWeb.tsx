import React, {Component, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {TouchableOpacity, View, Text, Alert} from 'react-native';
import StudentMain from './Main';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';

const AttendanceWeb = ({route, navigation}) => {
  // 웹뷰에서 데이터를 받을 때 필요한 함수입니다.
  console.log(route.params);

  let webRef = useRef<WebView>(null);
  const handleSetRef = _ref => {
    webRef = _ref;
  };
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const native_to_web = () => {
    console.log('accessToken', accessToken);
    console.log('token', webRef.postMessage(accessToken));
  };
  const handleOnMessage = e => {
    const res = JSON.parse(e.nativeEvent.data).data;
    console.log('web 으로부터 받은 데이터', res);
    if (res === 1) {
      Alert.alert(
        //alert 사용
        '',
        '출석이 완료되었습니다!',
        [
          //alert창 문구 작성]
          {
            text: '출석',
            onPress: () => {
              navigation.navigate('StudentMain');
            },
          }, //alert 버튼 작성
        ],
      );
    } else {
      Alert.alert(
        //alert 사용
        '',
        '이미 출석처리된 수업입니다!',
        [
          //alert창 문구 작성]
          {
            text: '출석',
            onPress: () => {
              navigation.navigate('StudentMain');
            },
          }, //alert 버튼 작성
        ],
      );
    }
  };

  console.log('url', route.params);
  // RN에서 웹뷰로 데이터를 보낼 때 사용하는 함수입니다.

  return (
    <WebView
      ref={handleSetRef}
      onLoad={native_to_web}
      javaScriptEnabled={true}
      onMessage={handleOnMessage}
      source={{uri: route.params}}
      setSupportMultipleWindows={false}
      // originWhitelist={["https://"]}
    />
  );
};

export default AttendanceWeb;
