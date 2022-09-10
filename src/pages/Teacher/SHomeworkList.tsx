import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Button} from 'native-base';
import {width, height} from '../../config/globalStyles';
import HomeworkDetailModal from '../../components/HomeworkDetailModal';

type SHomeworkListScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'SHomeworkList'
>;

export default function SHomeworkList(
  this: any,
  {route}: SHomeworkListScreenProps,
) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [data, setData] = useState([]);
  const [datalength, setDatalength] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const thId = route.params.thId;
  const courseName = route.params.courseName;
  const [checked, setChecked] = useState([]);
  const [checkedlist, setCheckedlist] = useState([]);
  const jsonArray = new Array();
  const [checklist, setChecklist] = useState([]);
  const scrollRef = useRef();

  let datalist2 = new Map();
  let cklist: string[] | ((prevState: never[]) => never[]) = [];

  const fetchItems = () => {
    if (!isRefreshing) {
      getSHomeworks();
    }
  };

  const selectGrade = () => {
    Alert.alert(
      //     말그대로 Alert를 띄운다
      '', // 첫번째 text: 타이틀 제목
      '등급을 선택하세요.', // 두번째 text: 그 밑에 작은 제목
      [
        //   버튼 배열
        {
          text: '닫기', // 버튼 제목
        },
        {text: '1차', onPress: () => saveGrade('1차')}, //버튼 제목
        // 이벤트 발생시 로그를 찍는다
        {text: '2차', onPress: () => saveGrade('2차')},
      ],
      {cancelable: true},
    );
  };

  const saveGrade = async (state: string) => {
    for (let c of checked) {
      data[c - 1].deadline = state;
      data[c - 1].disabled = true;
    }
    setData(data);
    const dd = JSON.stringify(data);
    setChecked([]);
    setCheckedlist([]);
    console.log('data:', data);
    setIsRefreshing(true);
    console.log('checklist:', checklist);
    // console.log('data22: ', data22);
    Alert.alert('', state + ' 포인트 부여 완료!');

    const axios = require('axios');
    const config = {
      method: 'put',
      url: `${Config.API_URL}/api/sh/point`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: dd,
    };

    axios(config)
      .then(function (response: {data: any}) {
        console.log(JSON.stringify(response.data));
        console.log(response.data);
        setIsRefreshing(false);
      })
      .catch(function (error: any) {
        console.log(error);
        Alert.alert('An error has occurred');
        setIsRefreshing(false);
      });
  };

  const getSHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios
      .get(`${Config.API_URL}/api/sh/list/${thId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        console.log(response);
        setDatalength(response.data.length);
        let datalist = [];
        for (let i = 0; i < response.data.length; i++) {
          datalist.push({
            id: i + 1,
            shId: response.data[i].shId,
            name: response.data[i].name,
            title: response.data[i].title,
            deadline: response.data[i].deadline,
            ischecked: response.data[i].ischecked,
            disabled: false,
          });

          if (datalist[i].ischecked == true) {
            datalist[i].disabled = true;
          }
        }

        setData(datalist);
        console.log('datalist :', datalist);
        console.log(thId);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  const submitChecked = async () => {
    console.log('보낼 값: ', checklist);
    setIsRefreshing(true);
    try {
      const response = await axios.post(`${Config.API_URL}/api/sh/point`, {
        checklist: checklist,
      });
      console.log(response);
      setIsRefreshing(false);
    } catch (error) {
      Alert.alert('An error has occurred');
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getSHomeworks();
  }, [datalength]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseArea}>
        <Text style={styles.courseName}> #{courseName}</Text>
      </View>
      <View style={styles.listArea}>
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            ref={scrollRef}
            data={data}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            keyExtractor={item => item.id.toString()}
            extraData={checked}
            style={{height: '80%'}}
            renderItem={({item, index}) => {
              console.log('item', item);
              return (
                <View style={styles.flatList} key={index.toString()}>
                  <View>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.text}>{item.title}</Text>
                  </View>
                  <BouncyCheckbox
                    isChecked={item.ischecked}
                    disabled={item.disabled}
                    size={width * 25}
                    fillColor="#ff4c4c"
                    unfillColor="#FFFFFF"
                    text="check"
                    iconStyle={{borderColor: '#ff4c4c'}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                    onPress={() => {
                      const newIds = [...checked];
                      const newshIds = [...checkedlist];
                      const index = newIds.indexOf(item.id);
                      const shindex = newshIds.indexOf(item.shId);
                      if (index > -1) {
                        newIds.splice(index, 1);
                        newshIds.splice(shindex, 1);
                        item.ischecked = false;
                        console.log('index:', index);
                        console.log('item 이미 존재:', newIds);
                        console.log('item 이미 존재:', newshIds);
                        console.log('selected:', item.ischecked);
                      } else {
                        newIds.push(item.id);
                        newshIds.push(item.shId);
                        item.ischecked = true;
                        console.log('item 푸쉬', newIds);
                        console.log('item 푸쉬', newshIds);
                        console.log('selected:', item.ischecked);
                      }
                      newIds.sort();
                      newshIds.sort();
                      setChecked(newIds);
                      setCheckedlist(newshIds);
                      console.log('newIds', newIds);
                      console.log('newshIds', newshIds);
                    }}
                  />
                </View>
              );
            }}
          />
        )}
        <Button
          style={styles.button}
          size="lg"
          variant="subtle"
          onPress={() => {
            if (checkedlist.length == 0) {
              Alert.alert('수강생을 선택해주세요.');
            } else {
              selectGrade();
            }
          }}>
          과제 확인
        </Button>
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
    marginLeft: '40%',
    paddingBottom: '3%',
    // flex: 1,
    // backgroundColor: 'blue',
  },
  courseName: {
    fontSize: width * 23,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
    // backgroundColor: 'lightyellow',
    // marginRight: 250,
  },
  flatList: {
    borderRadius: 10,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    paddingHorizontal: width * 15,
    paddingVertical: height * 15,
    marginBottom: height * 10,
    marginHorizontal: width * 25,
    //backgroundColor: 'rgba(50,50,50,1)',
    backgroundColor: '#e0ffff',
    flexDirection: 'row',
    justifyContent: 'space-between', //space-around
  },
  title: {
    color: 'black',
    fontSize: width * 18,
    fontFamily: Fonts.TRBold,
    marginBottom: height * 3,
  },
  text: {
    color: 'gray',
    fontSize: width * 15,
    fontFamily: Fonts.TRRegular,
  },
  button: {
    marginVertical: height * 15,
    marginHorizontal: width * 150,
  },
});
