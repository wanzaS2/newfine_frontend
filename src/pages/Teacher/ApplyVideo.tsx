import React, {useEffect, useState} from 'react';
import Title from '../../components/Title';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import {ranking} from '../slices/ranking';
// import EachRanking from '../components/EachRanking';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import Icon from 'react-native-vector-icons/AntDesign';
function ApplyVideo({navigation}) {
  const [videoList, setVideos] = useState();
  const [listLength, setCourseLength] = useState();
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const fetchItems = () => {
    if (!isRefreshing) {
      getVideos();
    }
  };
  const showAlert = item => {
    console.log(item);
    Alert.alert(
      // 말그대로 Alert를 띄운다
      '', // 첫번째 text: 타이틀 제목
      '동영상을 보내셨습니까?', // 두번째 text: 그 밑에 작은 제목
      [
        // 버튼 배열
        {
          text: '네', // 버튼 제목
          onPress: () => sendVideo(item), //onPress 이벤트시 콘솔창에 로그를 찍는다
        },
        {text: '아니요', onPress: () => sendVideo(item), style: 'cancel'}, //버튼 제목
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
            when: response.data[i].attendance.startTime.slice(0, 10),
          });
        }
        setVideos(videos);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
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
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Title title="video" />
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            data={videoList}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            renderItem={({item, index}) => (
              <View
                style={{
                  borderColor: '#eee8aa',
                  borderWidth: 1,
                  padding: 5,
                  backgroundColor: '#ffffe0',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    color: 'black',
                  }}>
                  {item.sname}
                </Text>
                <Text
                  style={{
                    marginLeft: 36,
                    fontSize: 18,
                    color: 'black',
                  }}>
                  {item.when}
                </Text>
                <Text
                  style={{
                    marginLeft: 44,
                    fontSize: 18,
                    color: 'red',
                  }}>
                  {item.cname}
                </Text>
                <TouchableOpacity onPress={() => showAlert(item.id)}>
                  <Icon
                    name="checkcircleo"
                    size={24}
                    color="black"
                    style={{marginLeft: 10, marginTop: 2}}
                  />
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'white',
  },
});

export default ApplyVideo;
