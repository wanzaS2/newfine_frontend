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
// import {LocalNotification} from '../lib/LocalNotification';

export default function BoardList({route, navigation}) {
  const [datalist, setDatalist] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {courseId} = route.params;
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const fetchItems = () => {
    if (!isRefreshing) {
      getHomeworks();
    }
  };

  const getHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios
      .get(`${Config.API_URL}/api/homework/list/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setDatalist(response.data);
        console.log(response.data);
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
    <View style={{flex: 1, padding: 24, backgroundColor: 'white'}}>
      {isRefreshing ? (
        <ActivityIndicator />
      ) : (
        <FlatList
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
              <TouchableOpacity
                style={styles.container}
                key={index.toString()}
                onPress={() =>
                  navigation.navigate('BoardDetail', {
                    id: item.id,
                    courseId: courseId,
                  })
                }>
                <View>
                  <Text style={styles.title}>제목: {item.title}</Text>
                  <Text style={styles.text}>{item.modifiedDate}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SHomeworkList', {
                      thId: item.id,
                    })
                  }>
                  <Image
                    source={require('../assets/images/check.png')}
                    style={{
                      height: 40,
                      width: 40,
                      marginLeft: '60%',
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <RoundButton
        text="+"
        onPress={() => navigation.navigate('BoardSave', {courseId: courseId})}
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
