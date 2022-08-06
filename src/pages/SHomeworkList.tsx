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

export default function SHomeworkList({route}) {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {thId} = route.params;
  const [checkedList, setCheckedList] = useState([]);

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
        console.log(response.data);
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
    setIsRefreshing(true);
    try {
      const response = await axios.post(`${Config.API_URL}/api/sh/point`, {
        checkedList,
      });
      console.log(checkedList);
      setIsRefreshing(false);
    } catch (error) {
      Alert.alert('An error has occurred');
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getSHomeworks();
  }, []);

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
                    onCheckedElement(checkedList, item.shId);
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
          submitChecked();
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
});
