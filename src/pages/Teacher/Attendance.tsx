import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import {Divider} from 'native-base';

type AttendanceScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'Attendance'
>;

function Attendance({route, navigation}: AttendanceScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [AttendanceList, setAttendanceList] = useState();
  const [listLength, setAttendanceLength] = useState();
  const scrollRef = useRef();

  const getAttendances = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/attendances`, {
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
    getAttendances();
    console.log('AttendanceList : ', AttendanceList);
    console.log('listLength : ', listLength);
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      {/*<ScrollView stickyHeaderIndices={[0]}>*/}
      <View>
        <View style={styles.courseArea}>
          <Text style={styles.courseName}> #{route.params.cname}</Text>
        </View>
        {/*<Divider*/}
        {/*  my="2"*/}
        {/*  _light={{*/}
        {/*    bg: 'teal.500',*/}
        {/*  }}*/}
        {/*  _dark={{*/}
        {/*    bg: 'muted.50',*/}
        {/*  }}*/}
        {/*/>*/}
        <ScrollView>
          <View>
            <View>
              <FlatList
                ref={scrollRef}
                data={AttendanceList}
                renderItem={({item, index}) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('StudentAttendance', item)
                    }>
                    <View style={styles.box_list}>
                      <Text style={styles.dateText}>
                        {item.startTime.substring(0, 10)}
                      </Text>
                      <Text style={styles.timeText}>
                        {item.course.start_time}
                      </Text>
                    </View>
                  </Pressable>
                )}
                keyExtractor={item => String(item.attendanceId)}
              />
            </View>
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.box_list}>*/}
            {/*  <Text>dmdkr</Text>*/}
            {/*</View>*/}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  courseArea: {
    marginTop: '3%',
    marginLeft: '43%',
    paddingBottom: '3%',
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
  box_list: {
    justifyContent: 'center',
    borderColor: '#b0e0e6',
    borderBottomWidth: 1,
    padding: 15,
    backgroundColor: '#f0f9ff',
  },
  dateText: {
    marginLeft: '5%',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  timeText: {
    position: 'absolute',
    right: '7%',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: '#6a5acd',
  },
});

export default Attendance;
