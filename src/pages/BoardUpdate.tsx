import React, {useEffect, useState} from 'react';
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
import BoardDetail from './BoardDetail';

export default function BoardUpdate({route, navigation}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const id = route.params.id;
  const courseId = route.params.courseId;

  useEffect(() => {
    axios
      .get(`${Config.API_URL}/api/homework/${id}`)
      .then(res => {
        console.log(res.data.id);
        setTitle(res.data.title);
        setContent(res.data.content);
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
    try {
      const response = await axios.put(`${Config.API_URL}/api/homework/${id}`, {
        id,
        title,
        content,
      });
      console.log(response.data);
      console.log(id);
      Alert.alert('수정완료');
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
          <Text>Enter title:</Text>
          <TextInput
            multiline // 줄바꿈 가능
            style={styles.title}
            value={title}
            editable={!isLoading}
            onChangeText={val => setTitle(val)}
          />
          <Text>Enter content:</Text>
          <TextInput
            multiline
            style={styles.input}
            value={content}
            editable={!isLoading}
            onChangeText={val => setContent(val)}
          />
          <MyButton
            text="Edit Save"
            onPress={() => updateBoard()}
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
  title: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 300,
    height: 350,
    textAlignVertical: 'top',
  },
  text: {
    fontFamily: Fonts.TRRegular,
  },
});
