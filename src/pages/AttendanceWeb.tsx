import React from 'react';
import {WebView} from 'react-native-webview';
import {TouchableOpacity, View, Text, Alert} from 'react-native';
import Main from './Main';
const AttendanceWeb = ({route, navigation}) => {
  // 웹뷰에서 데이터를 받을 때 필요한 함수입니다.
  const handleOnMessage = e => {
    console.log(e.nativeEvent.data);
    if (e.nativeEvent.data.data == 0) {
      Alert.alert(
        //alert 사용
        '',
        '이미 출석된 수업입니다',
        [],
      );
    } else {
      Alert.alert(
        //alert 사용
        '',
        '출석되었습니다',
        [
          {
            text: '예', // 버튼 제목
            onPress: () => console.log('출석완료'), //onPress 이벤트시 콘솔창에 로그를 찍는다
          },
        ],
      );
    }
    navigation.navigate('Main');
  };
  console.log('url', route.params);
  // RN에서 웹뷰로 데이터를 보낼 때 사용하는 함수입니다.

  return <WebView onMessage={handleOnMessage} source={{uri: route.params}} />;
};

export default AttendanceWeb;
