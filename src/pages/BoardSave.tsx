import React, {useState} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import MyButton from '../components/MyButton';
import Config from 'react-native-config';
import {Fonts} from '../assets/Fonts';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {LocalNotification} from '../lib/LocalNotification';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';

export default function BoardSave({route, navigation}) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {courseId} = route.params;
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [date1, onChangeDate1] = useState(new Date()); // 선택 날짜
  const [mode1, setMode1] = useState('date'); // 모달 유형
  const [visible1, setVisible1] = useState(false); // 모달 노출 여부
  const [date2, onChangeDate2] = useState(new Date()); // 선택 날짜
  const [mode2, setMode2] = useState('date'); // 모달 유형
  const [visible2, setVisible2] = useState(false); // 모달 노출 여부
  const [datecheck, setDateCheck] = useState(false);
  const [timecheck, setTimeCheck] = useState(false);
  const [timecheck2, setTimeCheck2] = useState(false);

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
    if (!title.trim() || !content.trim()) {
      Alert.alert('제목 또는 내용이 없습니다.');
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
      navigation.navigate('BoardDetail', {
        id: response.data,
        courseId: courseId,
      });
    } catch (error) {
      Alert.alert('An error has occurred');
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <ScrollView style={styles.conView}>
          <Text style={styles.text}>Title</Text>
          <TextInput
            multiline // 줄바꿈 가능
            style={styles.title}
            placeholder="제목을 입력하세요."
            value={title}
            editable={!isLoading}
            onChangeText={val => setTitle(val)}
          />
          <Text style={styles.text}>Content</Text>
          <TextInput
            multiline
            style={styles.input}
            placeholder="내용을 입력하세요."
            value={content}
            editable={!isLoading}
            onChangeText={val => setContent(val)}
          />
          <View style={styles.datetime}>
            <Text style={styles.text2}>1차 마감기한:</Text>
            <TouchableOpacity onPress={onPressDate1}>
              <TextInput
                placeholder={format(new Date(date1), 'PPP', {locale: ko})}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressTime1}>
              <TextInput
                editable={false}
                placeholder={format(new Date(date1), 'p', {
                  locale: ko,
                })}
              />
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
            <Text style={styles.text2}>2차 마감기한:</Text>
            <TouchableOpacity onPress={onPressDate2}>
              <TextInput
                placeholder={format(new Date(date2), 'PPP', {locale: ko})}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressTime2}>
              <TextInput
                editable={false}
                placeholder={format(new Date(date2), 'p', {
                  locale: ko,
                })}
              />
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
          <MyButton
            text="Save"
            onPress={() => saveBoard()}
            title="Go Detail Screen"
            disabled={isLoading}
          />
        </ScrollView>
      </View>
    </DismissKeyboardView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conView: {
    width: '87%',
    flex: 1,
    flexDirection: 'column', // row
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around', //space-around
  },
  title: {
    borderWidth: 2,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 300,
  },
  input: {
    borderWidth: 2,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 300,
    height: 300,
    textAlignVertical: 'top',
  },
  text: {
    fontFamily: Fonts.TRRegular,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 18,
  },
  datetime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2: {
    marginRight: 15,
  },
  input2: {
    borderWidth: 2,
    borderColor: '#777',
  },
});
