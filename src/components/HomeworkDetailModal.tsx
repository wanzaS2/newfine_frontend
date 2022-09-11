import React, {useCallback, useEffect, useState} from 'react';
import {Button, FormControl, Input, Modal, TextArea} from 'native-base';
import {
  Alert,
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

function HomeworkDetailModal({...props}) {
  console.log(props);
  // console.log(route.params);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const id = props.thId;
  const courseId = props.courseId;
  const [canUpdate, setCanUpdate] = useState(false);
  const [newDate1, onChangeDate1] = useState(new Date()); // 선택 날짜
  const [mode1, setMode1] = useState('date'); // 모달 유형
  const [visible1, setVisible1] = useState(false); // 모달 노출 여부
  const [newDate2, onChangeDate2] = useState(new Date()); // 선택 날짜
  const [mode2, setMode2] = useState('date'); // 모달 유형
  const [visible2, setVisible2] = useState(false); // 모달 노출 여부
  const [datecheck, setDateCheck] = useState(false);
  const [timecheck, setTimeCheck] = useState(false);
  const [timecheck2, setTimeCheck2] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  useEffect(() => {
    console.log('받은 param', id);
    axios
      .get(`${Config.API_URL}/api/homework/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        console.log(res.data.id);
        console.log(courseId);
        console.log('content: ', res.data.content);
        console.log(modalVisible);
        setModalVisible(true);
        setTitle(res.data.title);
        setContent(res.data.content);
        setDate1(res.data.fdeadline);
        setDate2(res.data.sdeadline);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const deleteBoard = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${Config.API_URL}/api/homework/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      console.log(id);
      Alert.alert('삭제완료');
      setIsLoading(false);
      setModalVisible(false);
      // navigation.navigate('BoardList', {courseId: route.params.courseId});
    } catch (error) {
      Alert.alert('An error has occurred');
      setIsLoading(false);
    }
  };

  const onChangeTitle = useCallback(text => {
    setTitle(text.trim());
  }, []);
  const onChangeContent = useCallback(text => {
    setContent(text.trim());
  }, []);

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

  function parse(str) {
    let datetime = str.split(' ');
    let datearr = datetime[0].split('-');
    let timearr = datetime[1].split(':');

    let date = new Date(
      datearr[0],
      datearr[1] - 1,
      datearr[2],
      timearr[0],
      timearr[1],
      timearr[2],
    );

    return date;
    // eslint-disable-next-line no-unreachable
    console.log(date);
  }

  const onPressDate1 = () => {
    console.log('onPressDate1: ', newDate1);
    if (new Date() > newDate1) {
      Alert.alert('1차 마감기한이 지났습니다.');
    } else {
      setMode1('date'); // 모달 유형을 date로 변경
      setVisible1(true); // 모달 open
      setTimeCheck(true);
    }
  };

  const onPressTime1 = () => {
    console.log('onPressTime1: ', newDate1);
    if (new Date() > newDate1) {
      Alert.alert('1차 마감기한이 지났습니다.');
    } else {
      if (timecheck) {
        setMode1('time'); // 모달 유형을 time으로 변경
        setVisible1(true);
      } else {
        Alert.alert('날짜부터 설정해주세요.');
      }
    }
  };

  const onConfirm1 = selectedDate => {
    setVisible1(false); // 모달 close
    onChangeDate1(selectedDate); // 선택한 날짜 변경
    setDateCheck(true);

    console.log('onConfirm1: ', newDate1);
    // 날짜 또는 시간 선택 시
  };

  const onCancel1 = () => {
    // 취소 시
    setVisible1(false); // 모달 close
  };

  const onPressDate2 = () => {
    console.log('onPressDate2: ', newDate2);
    if (new Date() > newDate2) {
      Alert.alert('2차 마감기한이 지났습니다.');
    } else {
      if (new Date() > newDate1) {
        setMode2('date'); // 모달 유형을 date로 변경
        setVisible2(true); // 모달 open
        setTimeCheck2(true);
      } else {
        if (datecheck) {
          setMode2('date'); // 모달 유형을 date로 변경
          setVisible2(true); // 모달 open
          setTimeCheck2(true);
        } else {
          Alert.alert('1차 마감기한부터 설정해주세요.');
        }
      }
    }
  };

  const onPressTime2 = () => {
    console.log('onPressTime2: ', newDate2);
    if (new Date() > newDate2) {
      Alert.alert('2차 마감기한이 지났습니다.');
    } else {
      if (new Date() > newDate1) {
        if (!timecheck2) {
          Alert.alert('날짜부터 설정해주세요.');
        } else {
          setMode2('time'); // 모달 유형을 date로 변경
          setVisible2(true); // 모달 open
        }
      } else {
        if (!datecheck) {
          Alert.alert('1차 마감기한부터 설정해주세요.');
        } else if (!timecheck2) {
          Alert.alert('날짜부터 설정해주세요.');
        } else {
          setMode2('time'); // 모달 유형을 date로 변경
          setVisible2(true); // 모달 open
        }
      }

      // 시간 클릭 시
      // setMode2('time'); // 모달 유형을 time으로 변경
      // setVisible2(true); // 모달 open
    }
  };

  const onConfirm2 = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible2(false); // 모달 close
    onChangeDate2(selectedDate); // 선택한 날짜 변경

    console.log('onConfirm2: ', selectedDate);
    console.log(newDate2);
  };

  const onCancel2 = () => {
    // 취소 시
    setVisible2(false); // 모달 close
  };

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/api/homework/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        console.log(res.data.id);
        setTitle(res.data.title);
        setContent(res.data.content);
        onChangeDate1(parse(res.data.fdeadline));
        onChangeDate2(parse(res.data.sdeadline));
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  const updateBoard = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Title or Content is invalid');
      return;
    }
    setIsLoading(true);
    let fdeadline = getYyyyMmDdMmSsToString(newDate1);
    setDate1(fdeadline);
    console.log('\n\n\n\nupdateBoard: ', fdeadline);
    console.log(newDate1);
    let sdeadline = getYyyyMmDdMmSsToString(newDate2);
    setDate2(sdeadline);
    console.log(sdeadline);
    try {
      const response = await axios.put(
        `${Config.API_URL}/api/homework/${id}`,
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
      console.log(response.data);
      console.log(id);
      Alert.alert('수정완료');
      setIsLoading(false);
      // navigation.navigate('BoardDetail', {
      //   id: response.data,
      //   courseId: courseId,
      // });
    } catch (error) {
      Alert.alert('An error has occurred');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size={'xl'}
      height={'100%'}
      isOpen={modalVisible}
      onClose={() => {
        setModalVisible(false);
        props.setModalVisible(false);
        props.onClose();
      }}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}>
      <Modal.Content height={'80%'}>
        <Modal.CloseButton />
        <Modal.Header>과제 작성</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>제목</FormControl.Label>
            <Input
              editable={canUpdate ? true : false}
              ref={initialRef}
              value={title}
              onChangeText={onChangeTitle}
            />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>상세 내용</FormControl.Label>
            <TextArea
              editable={canUpdate ? true : false}
              h={height * 40}
              placeholder="Text Area Placeholder"
              value={content}
              onChangeText={onChangeContent}
            />
          </FormControl>
          <View>
            {canUpdate ? (
              <View>
                <View style={styles.datetime}>
                  <Text style={styles.text}>1차 마감기한:</Text>
                  <TouchableOpacity onPress={onPressDate1}>
                    <Text>
                      {format(new Date(newDate1), 'PPP', {
                        locale: ko,
                      })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onPressTime1}>
                    <Text>
                      {format(new Date(newDate1), 'p', {
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
                  date={newDate1}
                  minimumDate={new Date()}
                />
                <View style={styles.datetime}>
                  <Text style={styles.text}>2차 마감기한:</Text>
                  <TouchableOpacity onPress={onPressDate2}>
                    <Text>
                      {format(new Date(newDate2), 'PPP', {locale: ko})}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onPressTime2}>
                    <Text>
                      {format(new Date(newDate2), 'p', {
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
                  date={newDate2}
                  minimumDate={newDate1}
                />
              </View>
            ) : (
              <View>
                <View style={styles.datetime}>
                  <Text style={styles.text}>1차 마감기한:</Text>
                  {/*<TouchableOpacity onPress={onPressDate1}>*/}
                  <TextInput placeholder={date1} editable={false} />
                </View>
                <View style={styles.datetime}>
                  <Text style={styles.text}>2차 마감기한:</Text>
                  <TextInput editable={false} placeholder={date2} />
                </View>
              </View>
            )}
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={3}>
            <Button
              variant="ghost"
              colorScheme={'darkBlue'}
              onPress={() => {
                setModalVisible(false);
                setCanUpdate(false);
                props.setModalVisible(false);
                props.onClose();
              }}>
              취소
            </Button>
            <Button
              colorScheme={'warning'}
              onPress={() => {
                setModalVisible(false);
                setCanUpdate(false);
                deleteBoard();
                props.setModalVisible(false);
                props.onClose();
              }}>
              삭제
            </Button>
            <Button
              colorScheme={'darkBlue'}
              onPress={() => {
                setCanUpdate(!canUpdate);
                console.log(canUpdate);
                if (canUpdate === true) {
                  updateBoard();
                }
              }}>
              {canUpdate ? '저장하기' : '변경하기'}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

export default HomeworkDetailModal;
