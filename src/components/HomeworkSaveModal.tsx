import React, {useState} from 'react';
import {Button, FormControl, Input, Modal, TextArea} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import axios from 'axios';
import Config from 'react-native-config';
import {format} from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {width, height} from '../config/globalStyles';
import {space} from "native-base/lib/typescript/theme/styled-system";


function HomeworkSaveModal({...props}) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [id, setId] = useState('');
  const {courseId} = props;
  // const [datalength, setDatalength] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date1, onChangeDate1] = useState(new Date()); // 선택 날짜
  const [mode1, setMode1] = useState('date'); // 모달 유형
  const [visible1, setVisible1] = useState(false); // 모달 노출 여부
  const [date2, onChangeDate2] = useState(new Date()); // 선택 날짜
  const [mode2, setMode2] = useState('date'); // 모달 유형
  const [visible2, setVisible2] = useState(false); // 모달 노출 여부
  const [datecheck, setDateCheck] = useState(false);
  const [timecheck, setTimeCheck] = useState(false);
  const [timecheck2, setTimeCheck2] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  // const [showModal2, setShowModal2] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  function getYyyyMmDdMmSsToString(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!

    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    yyyy = yyyy.toString();
    mm = mm.toString();
    dd = dd.toString();

    let m = date.getHours();
    let s = date.getMinutes();

    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    m = m.toString();
    s = s.toString();

    const s1 = yyyy + '-' + mm + '-' + dd + ' ' + m + ':' + s + ':00';
    return s1;
  }
  const onPressDate1 = () => {
    console.log("press !!");
    // 날짜 클릭 시
    setMode1('date'); // 모달 유형을 date로 변경
    setVisible1(true); // 모달 open
    setTimeCheck(true);
  };

  const onPressTime1 = () => {
    if (timecheck) {
      setMode1('time'); // 모달 유형을 time으로 변경
      setVisible1(true);
    } else {
      Alert.alert('날짜부터 설정해주세요.');
    }
  };

  const onConfirm1 = selectedDate => {
    setVisible1(false); // 모달 close
    onChangeDate1(selectedDate); // 선택한 날짜 변경
    setDateCheck(true);

    console.log(date1);
    // 날짜 또는 시간 선택 시
  };

  const onCancel1 = () => {
    // 취소 시
    setVisible1(false); // 모달 close
  };

  const onPressDate2 = () => {
    if (datecheck) {
      setMode2('date'); // 모달 유형을 date로 변경
      setVisible2(true); // 모달 open
      setTimeCheck2(true);
    } else {
      Alert.alert('1차 마감기한부터 설정해주세요.');
    }
  };

  const onPressTime2 = () => {
    if (!datecheck) {
      Alert.alert('1차 마감기한부터 설정해주세요.');
    } else if (!timecheck2) {
      Alert.alert('날짜부터 설정해주세요.');
    } else {
      setMode2('time'); // 모달 유형을 date로 변경
      setVisible2(true); // 모달 open
    }
    // 시간 클릭 시
    // setMode2('time'); // 모달 유형을 time으로 변경
    // setVisible2(true); // 모달 open
  };

  const onConfirm2 = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible2(false); // 모달 close
    onChangeDate2(selectedDate); // 선택한 날짜 변경

    console.log(date2);
  };

  const onCancel2 = () => {
    // 취소 시
    setVisible2(false); // 모달 close
  };

  console.log('받은 param course', courseId);
  const saveBoard = async () => {
    if (!title.trim()) {
      Alert.alert('제목이 없습니다.');
      return;
    }
    setIsLoading(true);
    let fdeadline = getYyyyMmDdMmSsToString(date1);
    console.log(fdeadline);
    let sdeadline = getYyyyMmDdMmSsToString(date2);
    console.log(sdeadline);
    try {
      const response = await axios.post(
        `${Config.API_URL}/api/homework/post/${courseId}`,
        {
          id,
          title,
          content,
          fdeadline,
          sdeadline,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('아이디 반환:', response.data);
      setId(response.data);
      console.log('글의 아이디:', response.data);
      Alert.alert('저장완료');
      setIsLoading(false);
      // navigation.navigate('BoardDetail', {
      //   id: response.data,
      //   courseId: courseId,
      // });
    } catch (error) {
      Alert.alert('An error has occurred');
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Pressable onPress={() => setModalVisible(true)}>
      <AntDesign name={'pluscircle'} size={width * 60} color={'#0077e6'} />
      <Modal
        size={'xl'}
        height={'100%'}
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}>
        <Modal.Content height={'80%'}>
          <Modal.CloseButton />
          <Modal.Header>과제 작성</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>제목</FormControl.Label>
              <Input
                ref={initialRef}
                value={title}
                onChangeText={val => setTitle(val)}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>상세 내용</FormControl.Label>
              <TextArea
                h={height * 40}
                placeholder="Text Area Placeholder"
                value={content}
                onChangeText={val => setContent(val)}
              />
            </FormControl>
              <View style={styles.datetime}>
                <Text style={styles.text}>1차 마감기한:</Text>
                <TouchableOpacity onPress={onPressDate1}>
                  <Text>
                    {format(new Date(date1), 'PPP', {locale: ko})}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressTime1}>
                  <Text>
                    &nbsp;{format(new Date(date1), 'p', {
                      locale: ko,
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={visible1}
                mode={mode1}
                onConfirm={onConfirm1}
                onCancel={onCancel1}
                date={date1}
                // filterDate={isPossibleDay}
                minimumDate={new Date()}
              />
              <View style={styles.datetime}>
                <Text style={styles.text}>2차 마감기한:</Text>
                <TouchableOpacity onPress={onPressDate2}>
                  <Text>
                    {format(new Date(date2), 'PPP', {locale: ko})}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressTime2}>
                  <Text>
                    &nbsp;{format(new Date(date2), 'p', {
                      locale: ko,
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={visible2}
                mode={mode2}
                onConfirm={onConfirm2}
                onCancel={onCancel2}
                date={date2}
                minimumDate={date1}
              />
          </Modal.Body>
          <Modal.Footer>
            {/*<Button*/}
            {/*  colorScheme={'darkBlue'}*/}
            {/*  flex="1"*/}
            {/*  onPress={() => {*/}
            {/*    setShowModal2(true);*/}
            {/*  }}>*/}
            {/*  다음*/}
            {/*</Button>*/}
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}>
                취소
              </Button>
              <Button
                colorScheme={'darkBlue'}
                onPress={() => {
                  setModalVisible(false);
                  saveBoard();
                }}>
                저장
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // button: {
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: '#000',
  //       shadowOffset: {
  //         width: 10,
  //         height: 10,
  //       },
  //       shadowOpacity: 0.5,
  //       shadowRadius: 10,
  //     },
  //     android: {
  //       elevation: 5,
  //     },
  //   }),
  // },
  datetime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginRight: width * 5,
    color: '#0077e6',
  },
});

export default HomeworkSaveModal;
