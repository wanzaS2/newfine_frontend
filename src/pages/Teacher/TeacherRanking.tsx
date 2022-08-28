// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   Dimensions,
//   FlatList,
//   SafeAreaView,
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   Pressable,
// } from 'react-native';
// import Config from 'react-native-config';
// import axios, {AxiosError} from 'axios';
// import {useSelector} from 'react-redux';
// import {RootState} from '../../store/reducer';
// import {useFocusEffect} from '@react-navigation/native';
// import {Fonts} from '../../assets/Fonts';
// // import MyModal from '../components/MyModal';
// import Modal from 'react-native-modal';
//
// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;
//
// function TeacherRanking({navigation}) {
//   const accessToken = useSelector((state: RootState) => state.user.accessToken);
//   const [rankingList, setRankingList] = useState();
//   const [listLength, setListLength] = useState();
//   const [rankInfo, setRankInfo] = useState([]);
//   const [rankNumber, setRankNumber] = useState([]);
//   const [sorting, setSorting] = useState('pointDesc');
//   const scrollRef = useRef();
//
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [modalName, setModalName] = useState('');
//   const [modalPhoneNumber, setModalPhoneNumber] = useState('');
//
//   const getStudentInfo = async ({...props}) => {
//     try {
//       let nickname = props.nickname;
//       console.log('닉: ', nickname);
//       const response = await axios.get(`${Config.API_URL}/member/${nickname}`, {
//         params: {},
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       console.log('학생 정보 출력: ', response.data);
//       setModalName(response.data.name);
//       setModalPhoneNumber(response.data.phoneNumber);
//     } catch (error) {
//       const errorResponse = (error as AxiosError).response;
//       if (errorResponse) {
//         Alert.alert('알림', errorResponse.data.message);
//       }
//     }
//   };
//
//   const getRanking = async () => {
//     try {
//       const response = await axios.get(`${Config.API_URL}/ranking/allRank`, {
//         params: {},
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//
//       console.log('리스트 출력: ', response.data);
//       setRankingList(response.data.data);
//       setListLength(response.data.data.length);
//
//       // let list = [];
//       // for (let i = 0; i < response.data.data.length; i++) {
//       //   list.push({
//       //     nickname: response.data.data[i].nickname,
//       //     score: response.data.data[i].score,
//       //   });
//       // }
//
//       // console.log(list);
//       // setRankInfo(list);
//     } catch (error) {
//       const errorResponse = (error as AxiosError).response;
//       if (errorResponse) {
//         Alert.alert('알림', errorResponse.data.message);
//       }
//     }
//   };
//
//   useFocusEffect(
//     useCallback(() => {
//       getRanking();
//     }, []),
//   );
//
//   useEffect(() => {
//     getRanking();
//     console.log('rankingList : ', rankingList);
//     console.log('listLength : ', listLength);
//     rank_num_function();
//     setRankNumber(list);
//   }, [sorting, listLength]);
//
//   let list = [1]; //순위가 담길 배열. 처음 사람은 1위 고정
//   let temp = 0; //공동 순위 동안 누적될 순위
//   let rank_number = 1; //실제 표시될 순위
//
//   //공동 순위 구현함수
//   const rank_num_function = () => {
//     //for문으로 리스트 전체 탐색하면서 이전 인덱스랑 점수가 같으면 순위 그대로 유지하고 temp(누적되는 순위) 1 증가
//     //다르면 누적된 만큼 +해서 순위 출력 후 temp=0으로 초기화
//     for (let i = 1; i < listLength; i++) {
//       if (rankingList[i].score === rankingList[i - 1].score) {
//         list.push(rank_number);
//         temp += 1;
//       } else {
//         rank_number += 1 + temp;
//         list.push(rank_number);
//         temp = 0;
//       }
//     }
//   };
//
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'white',
//       }}>
//       <FlatList
//         style={{marginTop: 15}}
//         ref={scrollRef}
//         data={rankingList}
//         keyExtractor={(item, index) => {
//           return `pointHistory-${index}`;
//         }}
//         renderItem={({item, index}) => (
//           <View>
//             <Pressable
//               onPress={() => {
//                 console.log('네: ', item.nickname);
//                 getStudentInfo({nickname: item.nickname});
//                 setModalVisible(true);
//               }}
//               style={{
//                 width: screenWidth - 10,
//                 height: 60,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginTop: 10,
//                 borderRadius: 8,
//                 borderColor: 'skyblue',
//                 borderWidth: 2,
//                 backgroundColor:
//                   rankNumber[index] === 1
//                     ? 'lightyellow'
//                     : rankNumber[index] === 2
//                     ? 'gainsboro'
//                     : rankNumber[index] === 3
//                     ? 'tan'
//                     : 'white',
//               }}>
//               <Text style={styles.textBottom}>{rankNumber[index]}위</Text>
//               <Text style={styles.textBottom}>
//                 {item.nickname}님 {item.score}점
//               </Text>
//               {/*<MyModal isVisible={visible} />*/}
//               <Modal
//                 //isVisible Props에 State 값을 물려주어 On/off control
//                 isVisible={modalVisible}
//                 //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
//                 useNativeDriver={true}
//                 hideModalContentWhileAnimating={true}
//                 style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <View style={styles.modalContainer}>
//                   <View style={styles.modalWrapper}>
//                     <Text style={styles.modalWrapperText}>학생 정보</Text>
//                   </View>
//
//                   <View style={styles.horizontalLine} />
//                   <View
//                     style={{
//                       marginVertical: 10,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Text style={{fontFamily: Fonts.TRRegular, fontSize: 20}}>
//                       이름: {modalName}
//                     </Text>
//                     <Text style={{fontFamily: Fonts.TRRegular, fontSize: 20}}>
//                       전화번호: {modalPhoneNumber}
//                     </Text>
//                   </View>
//                   <View style={styles.horizontalLine} />
//
//                   <Pressable
//                     style={styles.modalButton}
//                     onPress={() => {
//                       setModalVisible(false);
//                     }}>
//                     <Text
//                       style={{
//                         fontWeight: 'bold',
//                         color: 'white',
//                         alignSelf: 'center',
//                         fontFamily: Fonts.TRRegular,
//                         fontSize: 20,
//                       }}>
//                       확인
//                     </Text>
//                   </Pressable>
//                 </View>
//               </Modal>
//             </Pressable>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }
//
// const styles = StyleSheet.create({
//   textTop: {fontFamily: Fonts.TRRegular, fontSize: 13},
//   textBottom: {fontFamily: Fonts.TRBold, fontSize: 17},
//   modalContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     /* 모달창 크기 조절 */
//     width: 320,
//     height: 220,
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     borderRadius: 10,
//   },
//   modalWrapper: {
//     flex: 1,
//     width: 320,
//     justifyContent: 'center',
//   },
//   modalWrapperText: {
//     marginTop: 10,
//     alignSelf: 'center',
//     fontFamily: Fonts.TRRegular,
//     fontSize: 25,
//   },
//   modalButton: {
//     width: 100,
//     justifyContent: 'center',
//     backgroundColor: 'darkblue',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   horizontalLine: {
//     backgroundColor: 'black',
//     height: 1,
//     alignSelf: 'stretch',
//   },
// });
// export default TeacherRanking;
