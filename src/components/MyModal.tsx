import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {Fonts} from '../assets/Fonts';

function MyModal({...props}) {
  const [modalVisible, setModalVisible] = useState<boolean>(props.isVisible);

  console.log(modalVisible);
  // const [modalOutput, setModalOutput] = useState<string>('Open Modal');

  // const modifyVisible = () => {
  //   setModalVisible(props.isVisible);
  // };
  //
  // useEffect(() => {
  //   // setModalVisible(props.isVisible);
  //   modifyVisible();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        //isVisible Props에 State 값을 물려주어 On/off control
        isVisible={modalVisible}
        //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            <Text>{props.title}</Text>
          </View>

          <View style={styles.horizontalLine} />
          <View>{props.content}</View>
          <View style={styles.horizontalLine} />

          <Pressable
            style={styles.modalButton}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={{alignSelf: 'center'}}>확인</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    /* 모달창 크기 조절 */
    width: 320,
    height: 220,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
  },
  modalWrapper: {
    flex: 1,
    width: 320,
    justifyContent: 'center',
  },
  modalWrapperText: {
    alignSelf: 'center',
    fontFamily: Fonts.TRRegular,
    fontSize: 15,
  },
  modalButton: {
    width: 320,
    justifyContent: 'center',
  },
  horizontalLine: {
    backgroundColor: 'black',
    height: 1,
    alignSelf: 'stretch',
  },
});

export default MyModal;
