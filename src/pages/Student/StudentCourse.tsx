import React, {useEffect, useState} from 'react';
// import Title from '../../components/Title';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  // StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Badge, Box, Flex, HStack, Pressable} from 'native-base';
import {Fonts} from '../../assets/Fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type StudentCourseScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentCourse'
>;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function StudentCourse({navigation}: StudentCourseScreenProps) {
  const [courseList, setCourseList] = useState();
  const [listLength, setCourseLength] = useState();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const getCourses = () => {
    axios(`${Config.API_URL}/student/courses`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
    <SafeAreaView style={styles.container}>
      {/*<StatusBar style="auto" />*/}
      {/*<Title title="내 수업✔️" />*/}
      <View style={styles.listArea}>
        <FlatList
          data={courseList}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('StudentCourseInfo', item.course)
              }>
              <View style={styles.flatList}>
                <Text style={styles.classText}>{item.course.cname}</Text>
                <Text style={styles.subjectText}>
                  {item.course.subjectType}
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={item => String(item.id)}
        />
      </View>
    </SafeAreaView>
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
    paddingVertical: 15,
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 10,
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
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  subjectText: {
    position: 'absolute',
    right: 15,
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});

export default StudentCourse;
