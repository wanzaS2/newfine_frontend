import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Platform,
  Button,
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

type StudentBoardListScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentBoardList'
>;

export default function StudentBoardList({
  route,
  navigation,
}: StudentBoardListScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {courseId} = route.params;

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
                    onPress={
                      () => setShowModal(true)
                      // onPress={() =>
                      //   navigation.navigate('StudentBoardDetail', {
                      //     id: item.id,
                      //     courseId: courseId,
                      //   })
                    }>
                    <View style={styles.flatList}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.text}>{item.modifiedDate.substring(0, 10)}</Text>
                      <FontAwesome5Icon
                        name={'chevron-circle-right'}
                        size={35}
                        color={'white'}
                        style={{
                          position: 'absolute',
                          justifyContent: 'center',
                          right: 10,
                        }}
                      />
                    </View>
                  </Pressable>
                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    size={'lg'}>
                    <Modal.Content maxWidth="400px" height={'60%'}>
                      <Modal.CloseButton />
                      <Modal.Header>
                        <Text
                          style={{
                            fontFamily: Fonts.TRBold,
                            color: '#0077e6',
                            fontSize: 20,
                          }}>
                          {item.title}
                        </Text>
                      </Modal.Header>
                      <Modal.Body>
                        <Text
                          style={{
                            fontFamily: Fonts.TRRegular,
                            color: 'black',
                            fontSize: 16,
                          }}>
                          {item.content}
                        </Text>
                      </Modal.Body>
                      <Modal.Footer>
                        <Pressable
                          onPress={() => {
                            setShowModal(false);
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.TRBold,
                              color: '#0077e6',
                              fontSize: 18,
                            }}>
                            확인
                          </Text>
                        </Pressable>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                </View>
              );
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
          />
        )}
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
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  text: {
    marginLeft: '5%',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});
