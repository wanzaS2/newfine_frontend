import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Config from 'react-native-config';
import RoundButton from '../components/RoundButton';
import axios from 'axios';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import MyButton from '../components/MyButton';
import CheckBox from '@react-native-community/checkbox';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

export default function SHomeworkList(this: any, {route}) {
  const [data, setData] = useState([]);
  // const [checklist, setChecklist] = useState([]);
  // const [checklist, setChecklist] = useState([new Map()]);
  const [checklist2, setChecklist2] = useState([new Map()]);
  const [datalength, setDatalength] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {thId} = route.params;
  const [checked, setChecked] = useState([]);
  const [checkedlist, setCheckedlist] = useState([]);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const jsonArray = new Array();
  const [checklist, setChecklist] = useState([]);

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
          text: 'A', // 버튼 제목
          onPress: () => saveGrade('A'), //onPress 이벤트시 콘솔창에 로그를 찍는다
        },
        {text: 'B', onPress: () => saveGrade('B')}, //버튼 제목
        // 이벤트 발생시 로그를 찍는다
        {text: 'C', onPress: () => saveGrade('C')},
        {text: '닫기'},
      ],
      {cancelable: true},
    );
  };

  const saveGrade = async (state: string) => {
    for (let c of checked) {
      data[c - 1].grade = state;
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
    Alert.alert('', state + ' 등급 포인트 부여 완료!');

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
    // let checklist: {shId: string; grade: string}[];
    // let check = data.map(({shId, grade}) => ({shId, grade}));
    // console.log('result: ', check);
    // setChecklist(JSON.stringify(check));
    // console.log('result2: ', checklist);
    // console.log('result: ', checklist);
    // let checklist = JSON.stringify(data);
    // try {
    //   const response = await axios.put(
    //     `${Config.API_URL}/api/sh/merge`,
    //     {
    //       data22,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     },
    //   );
    //   console.log(response.data);
    //   setIsRefreshing(false);
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert('An error has occurred');
    //   setIsRefreshing(false);
    // }
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
        //this.setState({data: response.data});
        //console.log(this.state.data);
        setDatalength(response.data.length);
        let datalist = [];
        // const c: any[] | ((prevState: never[]) => never[]) = [];
        // console.log(c);
        for (let i = 0; i < response.data.length; i++) {
          // const json = new Object();
          datalist.push({
            id: i + 1,
            shId: response.data[i].shId,
            name: response.data[i].name,
            title: response.data[i].title,
            grade: response.data[i].grade,
            ischecked: response.data[i].ischecked,
            disabled: false,
          });
          // datalist2.set('id', i + 1);
          // datalist2.set('shId', response.data[i].shId);
          // datalist2.set('grade', response.data[i].grade);

          // console.log(Object.fromEntries(datalist2));
          // c.push(Object.fromEntries(datalist2));
          // console.log('c: ', c);

          // cklist.push(Object.fromEntries(datalist2));
          // json.id = i + 1;
          // json.shId = response.data[i].shId;
          // json.name = response.data[i].name;
          // json.title = response.data[i].title;
          // json.grade = response.data[i].grade;
          // json.ischecked = response.data[i].ischecked;
          // json.disabled = false;
          //
          // console.log('json:', json);
          // jsonArray.push(json);
          // console.log('jsonArray:', jsonArray);

          if (datalist[i].ischecked == true) {
            datalist[i].disabled = true;
          }
        }
        // check.push(checklist);
        // setjsonArray(jsonArray);
        // console.log('jsonArray:', jsonArray);
        setData(datalist);
        // setChecklist(jsonArray);
        // setChecklist2(c);
        // setChecklist(cklist);
        // setChecklist2(check);
        // console.log('check:', check);
        // setData2(checklist);
        console.log('datalist :', datalist);
        // console.log('datalist2 :', datalist2);
        // console.log('datalist2 object:', Object.fromEntries(datalist2));
        // console.log('cklist: ', cklist);
        // console.log('checklist: ', checklist);
        // console.log('checklist2: ', checklist2);
        console.log(thId);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  // const onCheckedElement = useCallback(
  //   (checked, id) => {
  //     if (checked) {
  //       setCheckedList([...checkedList, id]);
  //       console.log(checkedList);
  //     } else {
  //       setCheckedList(checkedList.filter(el => el !== id));
  //     }
  //   },
  //   [checkedList],
  // );

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

  // const onChangeValue = (item, index, newValue) => {
  //   const newData = data.map(newItem => {
  //     if (newItem.id == item.id) {
  //       return {
  //         ...newItem,
  //         selected: newValue,
  //       };
  //     }
  //     return newItem;
  //   });
  //   setData(newData);
  // };

  // const onShowItemSelected = () => {
  //   const listSelected = data.filter(item => item.selected === true);
  //   let contentAlert = '';
  //   listSelected.forEach(item => {
  //     checklist.push({id: item.shId});
  //     console.log(checklist);
  //     contentAlert = contentAlert + `${item.shId} + ` + item.title + '\n';
  //   });
  //   Alert.alert(contentAlert);
  //   submitChecked();
  // };

  useEffect(() => {
    getSHomeworks();
  }, [datalength]);

  return (
    <View style={{flex: 1, padding: 24, backgroundColor: 'white'}}>
      {isRefreshing ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          onRefresh={fetchItems} // fetch로 데이터 호출
          refreshing={isRefreshing} // state
          keyExtractor={item => item.id.toString()}
          extraData={checked}
          renderItem={({item, index}) => {
            console.log('item', item);
            return (
              <TouchableOpacity style={styles.container} key={index.toString()}>
                <View>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.text}>{item.title}</Text>
                </View>
                <BouncyCheckbox
                  isChecked={item.ischecked}
                  disabled={item.disabled}
                  size={25}
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
              </TouchableOpacity>
            );
          }}
        />
      )}
      <MyButton
        text="과제 확인"
        onPress={() => {
          if (checkedlist.length == 0) {
            Alert.alert('수강생을 선택해주세요.');
          } else {
            selectGrade();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: '#b0e0e6',
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    color: 'white',
    //backgroundColor: 'rgba(50,50,50,1)',
    backgroundColor: '#e0ffff',
    flexDirection: 'row',
    justifyContent: 'space-between', //space-around
  },
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  text: {
    color: 'gray',
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemSeparator: {
    backgroundColor: 'green',
    height: 1,
  },
  ckItem: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginRight: 10,
  },
});
