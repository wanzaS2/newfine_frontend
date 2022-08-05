import React, {useState} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import MyButton from '../components/MyButton';
import Config from 'react-native-config';
import {Fonts} from '../assets/Fonts';
import {useParams} from 'react-router-dom';

export default function BoardSave({route, navigation}) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {courseId} = route.params;

  console.log('받은 param course', courseId);
  const saveBoard = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Title or Content is invalid');
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
      );
      console.log('아이디 반환:', response.data);
      setId(response.data);
      console.log('글의 아이디:', id);
      Alert.alert('저장완료');
      setIsLoading(false);
      navigation.navigate('BoardDetail', {
        id: response.data,
        courseId: courseId,
      });
    } catch (error) {
      Alert.alert('An error has occurred');
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
});
