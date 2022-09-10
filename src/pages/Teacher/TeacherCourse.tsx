import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {width, height} from '../../config/globalStyles';

type TeacherCourseScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'TeacherCourse'
>;

function TeacherCourse({navigation}: TeacherCourseScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [courseList, setCourseList] = useState();
  const [listLength, setCourseLength] = useState();
  const scrollRef = useRef();

  const getCourses = () => {
    axios
      .get(`${Config.API_URL}/teacher/courses`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setCourseList(response.data);
        setCourseLength(response.data.length);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    getCourses();
    console.log('courseList : ', courseList);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.listArea}>
          <FlatList
            ref={scrollRef}
            data={courseList}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => navigation.navigate('TeacherCourseInfo', item)}>
                <View style={styles.flatList}>
                  <Text style={styles.classText}>
                    {item.cname}
                    {/*(요일을 추가해보자)*/}
                  </Text>
                  <FontAwesome5Icon
                    name={'caret-right'}
                    size={width * 30}
                    // color={'black'}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      right: width * 15,
                    }}
                  />
                </View>
              </Pressable>
            )}
            keyExtractor={item => String(item.id)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  listArea: {
    marginTop: '15%',
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    paddingVertical: '4%',
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: height * 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: width * 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: width * 10,
          height: height * 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  classText: {
    marginLeft: '5%',
    fontSize: width * 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
});

export default TeacherCourse;
