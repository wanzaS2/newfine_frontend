import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import AttendanceWeb from './AttendanceWeb';

import {useNavigation} from '@react-navigation/native';

const QRCodeScanner = ({navigation}) => {
  const [scaned, setScaned] = useState<boolean>(true);
  const ref = useRef(null);
  const [url, setUrl] = useState('');
  useEffect(() => {
    // 종료후 재시작을 했을때 초기화
    setScaned(true);
    setUrl('');
  }, []);

  const onBarCodeRead = (event: any) => {
    console.log(scaned);
    if (!scaned) {
      return;
    }
    setScaned(false);
    Vibration.vibrate();
    setUrl(event.nativeEvent.codeStringValue);
    console.log('url', event.nativeEvent.codeStringValue);
    setScaned(true);
    navigation.navigate('AttendanceWeb', event.nativeEvent.codeStringValue);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.scanner}
        ref={ref}
        cameraType={CameraType.Back} // Front/Back(default)
        focusMode={'on'}
        // Barcode Scanner Props
        scanBarcode={true}
        showFrame={false}
        laserColor="rgba(0, 0, 0, 0)"
        frameColor="rgba(0, 0, 0, 0)"
        surfaceColor="rgba(0, 0, 0, 0)"
        onReadCode={onBarCodeRead}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  scanner: {flex: 1},
});
export default QRCodeScanner;
