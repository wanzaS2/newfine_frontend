import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, FormControl, Input, Modal, TextArea} from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../assets/Fonts';
import HomeworkSaveModal from '../../components/HomeworkSaveModal';
// import {LocalNotification} from '../lib/LocalNotification';

type BoardListScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'BoardList'
>;

export default function BoardList({route, navigation}: BoardListScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [datalist, setDatalist] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const scrollRef = useRef();
  const courseId = route.params.id;

  function parse(str) {
    let datetime = str.split(' ');
    let datearr = datetime[0].split('-');
    let timearr = datetime[1].split(':');

    let date = new Date(
      datearr[0],
      datearr[1] - 1,
      datearr[2],
      timearr[0],
      timearr[1],
      timearr[2],
    );

    return date;
    // eslint-disable-next-line no-unreachable
    console.log(date);
  }

  // setInterval(function () {
  //   let dday = new Date('2022-')
  //   let today = new Date().getTime();
  //   let gap = dday - today;
  //   let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
  //   let hour = Math.ceil((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   let min = Math.ceil((gap % (1000 * 60 * 60)) / (1000 * 60));
  //   let sec = Math.ceil((gap % (1000 * 60)) / 1000);
  //
  //   console.log(
  //     'D-DAY까지 ',
  //     day,
  //     '일 ',
  //     hour,
  //     '시간 ',
  //     min,
  //     '분 ',
  //     sec,
  //     '초 남았습니다.',
  //   );
  // }, 1000);

  const fetchItems = () => {
    if (!isRefreshing) {
      getHomeworks();
    }
  };

  const getHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    console.log(courseId);
    axios
      .get(`${Config.API_URL}/api/homework/list/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setDatalist(response.data);
        console.log('awsgaisgnansgdfhlaukhkeg: ', response.data);
        console.log(courseId);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    getHomeworks();
    // LocalNotification();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseArea}>
        <Text style={styles.courseName}> #{route.params.cname}</Text>
      </View>
      <View style={styles.listArea}>
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <View>
            <View style={styles.buttonArea}>
              <HomeworkSaveModal courseId={courseId} />
              {/*<Pressable*/}
              {/*  onPress={() =>*/}
              {/*    navigation.navigate('BoardSave', {courseId: courseId})*/}
              {/*  }>*/}
              {/*  <AntDesign name={'pluscircle'} size={60} color={'red'} />*/}
              {/*</Pressable>*/}
            </View>
            <FlatList
              ref={scrollRef}
              data={datalist}
              onRefresh={fetchItems} // fetch로 데이터 호출
              refreshing={isRefreshing} // state
              keyExtractor={(item, index) => {
                // console.log("index", index)
                return index.toString();
              }}
              renderItem={({item, index}) => {
                console.log('item', item);
                return (
                  <Pressable
                    key={index.toString()}
                    onPress={() =>
                      navigation.navigate('BoardDetail', {
                        id: item.id,
                        courseId: courseId,
                      })
                    }>
                    <View style={styles.flatList}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.title}>과제) {item.title} </Text>
                        <Text style={styles.text}>({item.modifiedDate})</Text>
                      </View>
                      <Text style={styles.text}>
                        1차 마감기한: {item.fdeadline}
                      </Text>
                      <Text style={styles.text}>
                        2차 마감기한: {item.sdeadline}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('SHomeworkList', {
                            thId: item.id,
                          })
                        }>
                        <FontAwesome5Icon
                          name={'check-circle'}
                          size={40}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        )}
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
    marginLeft: '44%',
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
  buttonArea: {
    // backgroundColor: 'pink',
    // paddingTop: '5%',
    paddingBottom: '5%',
    alignItems: 'center',
  },
  listArea: {
    // marginTop: '15%',
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
  title: {
    color: 'black',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    marginLeft: 20,
    marginBottom: 3,
  },
  text: {
    fontSize: 15,
    fontFamily: Fonts.TRRegular,
    marginLeft: 20,
  },
  icon: {
    // color: 'gray',
    position: 'absolute',
    right: 20,
    bottom: 13,
  },
});
