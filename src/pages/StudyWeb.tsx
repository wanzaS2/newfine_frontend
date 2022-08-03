import React, {Component, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {TouchableOpacity, View, Text, Alert} from 'react-native';
import Main from './Main';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const StudyWeb = ({route, navigation}) => {
  // 웹뷰에서 데이터를 받을 때 필요한 함수입니다.
  console.log(route.params[0]);
  let webRef = useRef<WebView>(null);
  const handleSetRef = _ref => {
    webRef = _ref;
  };
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const native_to_web = () => {
    console.log('accessToken', accessToken);
    // let data = [];
    // data.push(route.params[1]);
    // data.push(accessToken);
    // console.log(data);

    console.log(
      'web 으로 전달하는 메시지',
      webRef.postMessage(
        JSON.stringify({
          token: accessToken,
          study_state: route.params[1],
        }),
      ),
    );
  };
  const handleOnMessage = e => {
    console.log('web 으로부터 받은 데이터', e.nativeEvent.data);
    console.log(route.params[1]);
    if (e.nativeEvent.data.data == 1) {
      if (route.params[1].localeCompare('in') == 0) {
        Alert.alert(
          //alert 사용
          '',
          'qr체크가 완료되었습니다',
          [
            //alert창 문구 작성]
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Study');
              },
            }, //alert 버튼 작성
          ],
        );
      } else {
        Alert.alert(
          //alert 사용
          '',
          '퇴실이 완료되었습니다',
          [
            //alert창 문구 작성]
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Study');
              },
            }, //alert 버튼 작성
          ],
        );
      }
    } else {
      console.log(route.params[1].localeCompare('in'));
      if (route.params[1].localeCompare('in') == 0) {
        Alert.alert(
          //alert 사용
          '',
          '이미 처리되었습니다',
          [
            //alert창 문구 작성]
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Main');
              },
            }, //alert 버튼 작성
          ],
        );
      } else {
        Alert.alert(
          //alert 사용
          '',
          '이미 처리되었습니다',
          [
            //alert창 문구 작성]
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Main');
              },
            }, //alert 버튼 작성
          ],
        );
      }
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
      source={{uri: route.params[0]}}
    />
  );
};

export default StudyWeb;
