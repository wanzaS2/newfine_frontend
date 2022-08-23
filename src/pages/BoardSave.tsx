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
  const [date, onChangeDate] = useState(new Date()); // 선택 날짜
  const [mode, setMode] = useState('date'); // 모달 유형
  const [visible, setVisible] = useState(false); // 모달 노출 여부

  const onPressDate = () => {
    // 날짜 클릭 시
    setMode('date'); // 모달 유형을 date로 변경
    setVisible(true); // 모달 open
  };

  const onPressTime = () => {
    // 시간 클릭 시
    setMode('time'); // 모달 유형을 time으로 변경
    setVisible(true); // 모달 open
  };

  const onConfirm = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible(false); // 모달 close
    onChangeDate(selectedDate); // 선택한 날짜 변경
  };

  const onCancel = () => {
    // 취소 시
    setVisible(false); // 모달 close
  };

  console.log('받은 param course', courseId);
  const saveBoard = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('제목 또는 내용이 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${Config.API_URL}/api/homework/post/${courseId}`,
        {
          id,
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('아이디 반환:', response.data);
      setId(response.data);
      console.log('글의 아이디:', response.data.id);
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
            <Text style={styles.text2}>마감기한 설정:</Text>
            <TouchableOpacity onPress={onPressDate}>
              <TextInput
                placeholder={format(new Date(date), 'PPP', {locale: ko})}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressTime}>
              <TextInput
                editable={false}
                placeholder={format(new Date(date), 'p', {
                  locale: ko,
                })}></TextInput>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={visible}
            mode={mode}
            onConfirm={onConfirm}
            onCancel={onCancel}
            date={date}
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
