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
  SafeAreaView,
} from 'react-native';
import Config from 'react-native-config';
import RoundButton from '../../components/RoundButton';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {ExpandableListView} from 'react-native-expandable-listview';
import Title from '../components/Title';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';

type StudentHomeworkScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentHomework'
>;

export default function StudentHomework({
  route,
  navigation,
}: StudentHomeworkScreenProps) {
  const [toggle, onToggle] = useState('');
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
    <SafeAreaView style={styles.container}>
      <View>
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <View>
            <View>
              <Text>확인 완료 된 과제</Text>
            </View>
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
                    key={index.toString()}
                    onPress={() =>
                      navigation.navigate('StudentBoardDetail', {
                        id: item.thId,
                      })
                    }>
                    <View>
                      <Text style={styles.title}>
                        {item.course} / {item.title} / {item.grade}
                      </Text>
                      <Text style={styles.text}>
                        확인일시: {item.checkedDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
