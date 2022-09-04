import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import {Modal, Pressable} from 'native-base';

type StudentHomeworkScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentHomework'
>;

export default function StudentHomework({route}: StudentHomeworkScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const [toggle, onToggle] = useState('');
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [showModal, setShowModal] = useState(false);

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
          <View style={{marginTop: '15%'}}>
            <View style={styles.completedHomework}>
              <Text style={styles.completedHomeworkText}>
                확인완료된 과제입니다~!
              </Text>
            </View>
            <View style={styles.listArea}>
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
                    <Pressable
                      style={styles.flatList}
                      key={index.toString()}
                      // onPress={() => setShowModal(true)}>
                    >
                      <View>
                        <Text style={styles.title}>
                          {item.course} : {item.title} ({item.deadline})
                        </Text>
                        <Text style={styles.text}>
                          확인 일시: {item.checkedDate}
                        </Text>
                      </View>
                      {/*<Modal*/}
                      {/*  isOpen={showModal}*/}
                      {/*  onClose={() => setShowModal(false)}*/}
                      {/*  size={'lg'}>*/}
                      {/*  <Modal.Content maxWidth="400px" height={'60%'}>*/}
                      {/*    <Modal.CloseButton />*/}
                      {/*    <Modal.Header>*/}
                      {/*      <Text*/}
                      {/*        style={{*/}
                      {/*          fontFamily: Fonts.TRBold,*/}
                      {/*          color: '#0077e6',*/}
                      {/*          fontSize: 20,*/}
                      {/*        }}>*/}
                      {/*        {item.title}*/}
                      {/*      </Text>*/}
                      {/*    </Modal.Header>*/}
                      {/*    <Modal.Body>*/}
                      {/*      <Text*/}
                      {/*        style={{*/}
                      {/*          fontFamily: Fonts.TRRegular,*/}
                      {/*          color: 'black',*/}
                      {/*          fontSize: 16,*/}
                      {/*        }}>*/}
                      {/*        {item.content}*/}
                      {/*      </Text>*/}
                      {/*    </Modal.Body>*/}
                      {/*    <Modal.Footer>*/}
                      {/*      <Pressable*/}
                      {/*        onPress={() => {*/}
                      {/*          setShowModal(false);*/}
                      {/*        }}>*/}
                      {/*        <Text*/}
                      {/*          style={{*/}
                      {/*            fontFamily: Fonts.TRBold,*/}
                      {/*            color: '#0077e6',*/}
                      {/*            fontSize: 18,*/}
                      {/*          }}>*/}
                      {/*          확인*/}
                      {/*        </Text>*/}
                      {/*      </Pressable>*/}
                      {/*    </Modal.Footer>*/}
                      {/*  </Modal.Content>*/}
                      {/*</Modal>*/}
                    </Pressable>
                  );
                }}
              />
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
    paddingBottom: 20,
  },
  completedHomeworkText: {
    fontFamily: Fonts.TRBold,
    fontSize: 20,
  },
  listArea: {
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
    backgroundColor: '#bae6fd',
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
  title: {
    marginLeft: '5%',
    marginBottom: '3%',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  text: {
    marginLeft: '5%',
    fontSize: 15,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});
