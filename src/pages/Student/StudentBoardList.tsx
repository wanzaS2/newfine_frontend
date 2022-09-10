import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../assets/Fonts';
import {Modal} from 'native-base';
import {width, height} from '../../config/globalStyles';

type StudentBoardListScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentBoardList'
>;

export default function StudentBoardList({route}: StudentBoardListScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const {courseId} = route.params;

  const handleOnSelectItem = item => {
    setSelectedItem(item);
    console.log('\n\n\n\n\n셀아: ', selectedItem);
  };

  const handleOnCloseModal = () => {
    setSelectedItem(null);
  };

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
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setData(response.data);
        console.log(response.data);
        console.log(courseId);
      })
      .catch(error => console.error(error))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    getHomeworks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listArea}>
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            onRefresh={fetchItems} // fetch로 데이터 호출
            refreshing={isRefreshing} // state
            renderItem={({item, index}) => {
              console.log('item', item);
              return (
                <View>
                  <Pressable
                    key={index.toString()}
                    onPress={() => {
                      handleOnSelectItem(item);
                      setShowModal(true);
                    }}>
                    <View style={styles.flatList}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.text}>
                        {item.modifiedDate.substring(0, 10)}
                      </Text>
                      <Text style={styles.text}>
                        1차 마감기한: {item.fdeadline}
                      </Text>
                      <Text style={styles.text}>
                        2차 마감기한: {item.sdeadline}
                      </Text>
                      <FontAwesome5Icon
                        name={'chevron-circle-right'}
                        size={width * 30}
                        color={'white'}
                        style={{
                          position: 'absolute',
                          justifyContent: 'center',
                          right: width * 10,
                        }}
                      />
                    </View>
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
          />
        )}
        <Modal
          // selectedItem={selectedItem}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            handleOnCloseModal();
          }}
          size={'lg'}>
          <Modal.Content maxWidth="400px" height={'60%'}>
            <Modal.CloseButton />
            <Modal.Header>
              <Text
                style={{
                  fontFamily: Fonts.TRBold,
                  color: '#0077e6',
                  fontSize: width * 20,
                }}>
                {selectedItem && selectedItem.title}
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text
                style={{
                  fontFamily: Fonts.TRRegular,
                  color: 'black',
                  fontSize: width * 16,
                }}>
                {selectedItem && selectedItem.content}
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  handleOnCloseModal();
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.TRBold,
                    color: '#0077e6',
                    fontSize: width * 18,
                  }}>
                  확인
                </Text>
              </Pressable>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listArea: {
    marginTop: '15%',
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  //   borderRadius: 10,
  //   borderColor: '#b0e0e6',
  //   borderWidth: 1,
  //   padding: 15,
  //   marginBottom: 10,
  //   color: 'white',
  //   //backgroundColor: 'rgba(50,50,50,1)',
  //   backgroundColor: '#e0ffff',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between', //space-around
  // },
  flatList: {
    // width: screenWidth,
    // alignItems: 'center',
    // marginTop: 5,
    paddingVertical: '3%',
    justifyContent: 'center',
    marginBottom: height * 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: width * 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: width * 10,
          height: height * 10,
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
    fontSize: width * 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  text: {
    marginLeft: '5%',
    fontSize: width * 17,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});
