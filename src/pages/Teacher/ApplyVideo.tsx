import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../assets/Fonts';
import {Divider} from 'native-base';

function ApplyVideo() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [videoList, setVideos] = useState();
  const [listLength, setListLength] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchItems = () => {
    if (!isRefreshing) {
      getVideos();
    }
  };
  const showAlert = item => {
    console.log(item);
    Alert.alert(
      // 말그대로 Alert 를 띄운다
      '', // 첫번째 text: 타이틀 제목
      '동영상을 보내셨습니까?', // 두번째 text: 그 밑에 작은 제목
      [
        // 버튼 배열
        {
          text: '네', // 버튼 제목
          onPress: () => {
            sendVideo(item);
            setListLength(listLength - 1);
          }, //onPress 이벤트시 콘솔창에 로그를 찍는다
        },
        {text: '아니요', onPress: () => {}, style: 'cancel'}, //버튼 제목
        // 이벤트 발생시 로그를 찍는다
      ],
    );
  };
  const getVideos = () => {
    axios(`${Config.API_URL}/video/list`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data);
        let videos = [];
        for (let i = 0; i < response.data.length; i++) {
          // 결석
          videos.push({
            id: response.data[i].studentAttendance.sattendanceId,
            sname: response.data[i].student.name,
            cname: response.data[i].course.cname,
            date: response.data[i].attendance.startTime.substring(0, 10),
            time: response.data[i].attendance.startTime.substring(11),
            // year: response.data[i].attendance.startTime[0],
            // month: response.data[i].attendance.startTime[1],
            // day: response.data[i].attendance.startTime[2],
            // hour: response.data[i].attendance.startTime[3],
            // minute: response.data[i].attendance.startTime[4],
          });
        }
        setVideos(videos);
      })
      .catch(error => console.error(error));
  };

  const sendVideo = id => {
    console.log(id);
    axios
      .put(
        `${Config.API_URL}/video/ok`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error(error))
      .finally();
  };
  useEffect(() => {
    getVideos();
  }, [listLength]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listArea}>
        <FlatList
          data={videoList}
          onRefresh={fetchItems} // fetch로 데이터 호출
          refreshing={isRefreshing} // state
          renderItem={({item, index}) => (
            <View style={styles.flatList}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.studentName}>{item.sname}</Text>
                <Divider
                  bg="orange.400"
                  thickness="2"
                  mx="2"
                  orientation="vertical"
                />
                <Text style={styles.dateText}>
                  {item.date} {item.time}
                  {/*{' '}*/}
                  {/*{item.year}.{item.month}.{item.day} {item.hour}:{item.minute}{' '}*/}
                </Text>
                <Divider
                  bg="orange.400"
                  thickness="2"
                  mx="2"
                  orientation="vertical"
                />
                <Text style={styles.classText}>{item.cname} </Text>
              </View>
              <TouchableOpacity onPress={() => showAlert(item.id)}>
                <Icon
                  name="check-circle"
                  size={24}
                  color="black"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
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
    paddingVertical: '4%',
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fde68a',
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
  studentName: {
    marginLeft: '3%',
    fontFamily: Fonts.TRBold,
    fontSize: 18,
    color: 'black',
  },
  dateText: {
    fontFamily: Fonts.TRRegular,
    fontSize: 15,
    color: 'black',
    // marginLeft: '3%',
  },
  classText: {
    // marginLeft: '3%',
    fontSize: 18,
    fontFamily: Fonts.TRBold,
    color: '#ef4444',
  },
  icon: {
    position: 'absolute',
    right: 12,
    bottom: 2,
  },
});

export default ApplyVideo;
