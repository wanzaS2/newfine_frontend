import React, {useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Title from '../components/Title';

export default function StudentHomework({route, navigation}) {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const fetchItems = () => {
    if (!isRefreshing) {
      getCheckedHomeworks();
    }
  };

  const getCheckedHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios
      .get(`${Config.API_URL}/api/shlist/checked`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    getCheckedHomeworks();
  }, []);

  return (
    <View style={{flex: 1, padding: 24, backgroundColor: 'white'}}>
      {isRefreshing ? (
        <ActivityIndicator />
      ) : (
        <>
          <Title title="제출 확인 ✔️" />
          <View>
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
                  <TouchableOpacity
                    style={styles.container}
                    key={index.toString()}>
                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.text}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </>
      )}
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
