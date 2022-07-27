import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import Attendance from './Attendance';
import CourseInfo from './CourseInfo';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
// import {ranking} from '../slices/ranking';
// import EachRanking from '../components/EachRanking';
import Config from 'react-native-config';
import axios from 'axios';

function TeacherCourse({navigation}) {
  const [courseList, setCourseList] = useState();
  const [listLength, setCourseLength] = useState();
  const [loading, setLoading] = useState(false);

  const getCourses = () => {
    axios(`${Config.API_URL}/teacher/courses`)
      .then(response => {
        setCourseList(response.data);
        setCourseLength(response.data.length);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCourses();
    console.log('courseList : ', courseList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title="내 수업✔️" />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={courseList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('CourseInfo', item)}>
                <View
                  style={{
                    borderRadius: 10,
                    borderColor: '#eee8aa',
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: '#fffacd',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Text
                      style={{
                        marginLeft: 30,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {item.cname}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        right: 30,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {item.teacher.tname} 선생님
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => String(item.cid)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default TeacherCourse;
