import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import {Modal, Pressable} from 'native-base';
import {width, height} from '../../config/globalStyles';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import hairlineWidth = StyleSheet.hairlineWidth;

type StudentHomeworkScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentHomework'
>;

export default function StudentHomework({route}: StudentHomeworkScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const [toggle, onToggle] = useState('');
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data2, setData2] = useState([]);
  const [isRefreshing2, setIsRefreshing2] = useState(false);
  const scrollRef = useRef();
  const scrollRef2 = useRef();
  const [visibleChecked, setVisibleChecked] = useState(false);
  const [visibleUnChecked, setVisibleUnChecked] = useState(false);

  const fetchItems = () => {
    if (!isRefreshing) {
      getCheckedHomeworks();
    }
  };

  const fetchItems2 = () => {
    if (!isRefreshing2) {
      getunCheckedHomeworks();
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

  const getunCheckedHomeworks = () => {
    setIsRefreshing(true);
    console.log('받은 param', route.params);
    axios
      .get(`${Config.API_URL}/api/shlist/unchecked`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setData2(response.data);
        console.log(response.data);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    getCheckedHomeworks();
  }, []);

  useEffect(() => {
    getunCheckedHomeworks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <View style={{marginTop: '15%'}}>
            <View style={styles.listArea1}>
              <Pressable
                style={styles.button1}
                onPress={() => {
                  if (visibleUnChecked) {
                    setVisibleUnChecked(false);
                  } else {
                    setVisibleUnChecked(true);
                  }
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: Fonts.TRBold,
                      fontSize: 19,
                    }}>
                    미확인 과제{' '}
                    <FontAwesome5Icon name={'angle-down'} size={17} />
                  </Text>
                </View>
              </Pressable>
              {visibleUnChecked && (
                <FlatList
                  ref={scrollRef}
                  data={data2}
                  onRefresh={fetchItems} // fetch로 데이터 호출
                  refreshing={isRefreshing} // state
                  // style={{height: '92%'}}
                  keyExtractor={(item, index) => {
                    // console.log("index", index)
                    return index.toString();
                  }}
                  renderItem={({item, index}) => {
                    console.log('item', item);
                    return (
                      <Pressable
                        style={styles.flatList1}
                        key={index.toString()}
                        // onPress={() => setShowModal(true)}>
                      >
                        <View>
                          <Text style={styles.title}>
                            {item.course} : {item.title} ({item.deadline})
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }}
                />
              )}
            </View>
            <View style={styles.listArea2}>
              <Pressable
                style={styles.button2}
                onPress={() => {
                  if (visibleChecked) {
                    setVisibleChecked(false);
                  } else {
                    setVisibleChecked(true);
                  }
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: Fonts.TRBold,
                      fontSize: 19,
                    }}>
                    확인완료된 과제{' '}
                    <FontAwesome5Icon name={'angle-down'} size={17} />
                  </Text>
                </View>
              </Pressable>
              {visibleChecked && (
                <View>
                  <FlatList
                    ref={scrollRef2}
                    data={data}
                    onRefresh={fetchItems2} // fetch로 데이터 호출
                    refreshing={isRefreshing} // state
                    // style={{height: '92%'}}
                    keyExtractor={(item, index) => {
                      // console.log("index", index)
                      return index.toString();
                    }}
                    renderItem={({item, index}) => {
                      console.log('item', item);
                      return (
                        <Pressable
                          style={styles.flatList2}
                          key={index.toString()}
                          // onPress={() => setShowModal(true)}>
                        >
                          <View>
                            <Text style={styles.title}>
                              {item.course} : {item.title} ({item.deadline})
                            </Text>
                            <Text style={styles.text}>
                              확인 일시: {item.modifiedDate}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    }}
                  />
                </View>
              )}
            </View>
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
  completedHomework: {
    alignItems: 'center',
    // backgroundColor: 'yellow',
    paddingBottom: height * 20,
  },
  completedHomeworkText: {
    fontFamily: Fonts.TRBold,
    fontSize: width * 20,
  },
  listArea1: {
    marginBottom: '5%',
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  listArea2: {
    marginBottom: '5%',
    // backgroundColor: 'green',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList2: {
    borderTopWidth: hairlineWidth,
    borderBottomWidth: hairlineWidth,
    borderColor: 'darkgray',
    // width: screenWidth,
    paddingVertical: '4%',
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    // marginBottom: height * 10,
    // borderRadius: 8,
    backgroundColor: '#bae6fd',
    // marginHorizontal: width * 10,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: width * 10,
    //       height: height * 10,
    //     },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 3,
    //   },
    // }),
  },
  flatList1: {
    borderTopWidth: hairlineWidth,
    borderBottomWidth: hairlineWidth,
    borderColor: 'darkgray',
    // width: screenWidth,
    paddingVertical: '4%',
    // alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    // marginBottom: height * 10,
    // borderRadius: 8,
    backgroundColor: '#bdc3c7',
    // marginHorizontal: width * 10,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: width * 10,
    //       height: height * 10,
    //     },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 3,
    //   },
    // }),
  },
  title: {
    marginLeft: '5%',
    marginBottom: '3%',
    fontSize: width * 17,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  text: {
    marginLeft: '5%',
    fontSize: width * 15,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
  button1: {
    backgroundColor: '#bdc3c7',
    paddingHorizontal: width * 20,
    paddingVertical: height * 10,
    // borderRadius: 5,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: width * 10,
    //       height: height * 10,
    //     },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 2,
    //   },
    // }),
  },
  button2: {
    backgroundColor: '#bae6fd',
    paddingHorizontal: width * 20,
    paddingVertical: height * 10,
    // borderRadius: 5,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: width * 10,
    //       height: height * 10,
    //     },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 10,
    //   },
    //   android: {
    //     elevation: 2,
    //   },
    // }),
  },
});
