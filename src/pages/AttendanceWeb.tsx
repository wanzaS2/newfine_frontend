import React, {Component, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {TouchableOpacity, View, Text, Alert} from 'react-native';
import Main from './Main';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const AttendanceWeb = ({route, navigation}) => {
  // 웹뷰에서 데이터를 받을 때 필요한 함수입니다.
  console.log(route.params);
  let webRef = useRef<WebView>(null);
  const handleSetRef = _ref => {
    webRef = _ref;
  };
  const native_to_web = () => {
    console.log(webRef.postMessage(accessToken));
  };
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const handleOnMessage = e => {
    console.log('웹으로부터받은메시지', e.nativeEvent.data);
    Alert.alert(
      //alert 사용
      '',
      '변경하시겠습니까?',
      [
        //alert창 문구 작성]
        {
          text: '출석',
          onPress: () => {
            navigation.navigate('Main');
          },
        }, //alert 버튼 작성
      ],
    );
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
    />
  );
};

export default AttendanceWeb;
