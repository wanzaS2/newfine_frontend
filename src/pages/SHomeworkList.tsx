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

export default function SHomeworkList(this: any, {route}) {
  const [data, setData] = useState([]);
  const [datalength, setDatalength] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {thId} = route.params;
  const [checkedList, setCheckedList] = useState([]);
  const datalist: {id: any; title: any; checked: boolean}[] = [];
  let checklist: any[] = [];

  const fetchItems = () => {
    if (!isRefreshing) {
      getSHomeworks();
    }
  };

  const getSHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios
      .get(`${Config.API_URL}/api/sh/list/${thId}`)
      .then(response => {
        setData(response.data);
        //this.setState({data: response.data});
        //console.log(this.state.data);
        console.log(response.data);
        setDatalength(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          datalist.push({
            id: response.data[i].shId,
            title: response.data[i].title,
            checked: false,
          });
        }
        console.log(datalist);
        console.log(thId);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  const onCheckedElement = useCallback(
    (checked, id) => {
      if (checked) {
        setCheckedList([...checkedList, id]);
        console.log(checkedList);
      } else {
        setCheckedList(checkedList.filter(el => el !== id));
      }
    },
    [checkedList],
  );

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

  const onChangeValue = (itemSelected, index) => {
    const newData = data.map(item => {
      if (item.id == itemSelected.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setData(newData);
  };

  const onShowItemSelected = () => {
    const listSelected = data.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      checklist.push({id: item.shId});
      console.log(checklist);
      contentAlert = contentAlert + `${item.shId} + ` + item.title + '\n';
    });
    Alert.alert(contentAlert);
    submitChecked();
  };

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
          keyExtractor={(item, index) => {
            // console.log("index", index)
            return index.toString();
          }}
          renderItem={({item, index}) => {
            console.log('item', item);
            console.log('index', index);
            console.log('item의 id', item.shId);
            return (
              <TouchableOpacity style={styles.container} key={index.toString()}>
                <View>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.text}>{item.title}</Text>
                </View>
                <BouncyCheckbox
                  size={25}
                  fillColor="#ff4c4c"
                  unfillColor="#FFFFFF"
                  text="check"
                  iconStyle={{borderColor: '#ff4c4c'}}
                  textStyle={{fontFamily: 'JosefinSans-Regular'}}
                  onPress={() => {
                    onChangeValue(item, index);
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
          onShowItemSelected();
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
