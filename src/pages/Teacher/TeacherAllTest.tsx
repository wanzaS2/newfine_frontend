import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Fonts} from '../../assets/Fonts';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type TeacherAllTestScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'TeacherAllTest'
>;

function TeacherAllTest({route, navigation}: TeacherAllTestScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();

  const getTests = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/course/teacher`, {
      params: {id: route.params.id},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        setAttendanceList(response.data);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    getTests();
    console.log('AttendanceList : ', AttendanceList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseArea}>
        <Text style={styles.courseName}> #{route.params.cname}</Text>
      </View>
      <View style={styles.listArea}>
        <FlatList
          data={AttendanceList}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => navigation.navigate('TeacherTest', item.id)}>
              <View style={styles.flatList}>
                <Text style={styles.classText}>{item.testName}</Text>
                <Text style={styles.dateText}>{item.testDate.slice(5)}</Text>
              </View>
              <FontAwesome5Icon
                name={'caret-right'}
                size={30}
                color={'black'}
                style={{
                  position: 'absolute',
                  bottom: 22,
                  right: 25,
                }}
              />
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
  courseArea: {
    marginTop: '3%',
    marginLeft: '32%',
    paddingBottom: '5%',
    // flex: 1,
    // backgroundColor: 'blue',
  },
  courseName: {
    fontSize: 23,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
    // backgroundColor: 'lightyellow',
    // marginRight: 250,
  },
  listArea: {
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
  dateText: {
    position: 'absolute',
    right: 40,
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});

export default TeacherAllTest;
