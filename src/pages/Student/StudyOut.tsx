import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Vibration, View} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import StudyWeb from './StudyWeb';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type StudyOutScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudyOut'
>;

const StudyOut = ({navigation}: StudyOutScreenProps) => {
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
    let params = [];
    params.push(event.nativeEvent.codeStringValue);
    params.push('out');

    navigation.navigate('StudyWeb', params);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.scanner}
        ref={ref}
        cameraType={CameraType.Back} // Front/Back(default)
        focusMode={CameraType.Back}
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
export default StudyOut;
