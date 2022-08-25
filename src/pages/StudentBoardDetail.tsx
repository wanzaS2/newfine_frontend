import React, {useEffect, useState} from 'react';
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
import {Fonts} from '../assets/Fonts';
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";

export default function StudentBoardDetail({route, navigation}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const id = route.params.id;
  const courseId = route.params.courseId;
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    console.log('받은 param', id);
    axios
      .get(`${Config.API_URL}/api/homework/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        console.log(res.data.id);
        console.log(courseId);
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(err => {
        console.log(err);
      });
  });

  /*useEffect(() => {
    const detailBoard = async () => {
      console.log({id});
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${Config.API_URL}/api/homework/${id}`,
        );
        console.log(response.data);
        setIsLoading(false);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        Alert.alert('An error has occurred');
        setIsLoading(false);
      }
    };
    if (id) {
      detailBoard();
    }
  }, [id]);
   */

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <ScrollView style={styles.conView}>
          <Text style={styles.text}>Title</Text>
          <TextInput
            editable={false}
            multiline // 줄바꿈 가능
            style={styles.title}
            value={title}
          />
          <Text style={styles.text}>Content</Text>
          <TextInput
            editable={false}
            multiline
            style={styles.input}
            value={content}
          />
        </ScrollView>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
