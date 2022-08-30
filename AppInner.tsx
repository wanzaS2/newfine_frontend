import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import SignUpAuth from './src/pages/SignUpAuth';
import Ranking from './src/pages/Ranking';
import Main from './src/pages/Student/Main';
import Welcome from './src/pages/Welcome';
import TeacherCourse from './src/pages/Teacher/TeacherCourse';
import TeacherCourseInfo from './src/pages/Teacher/TeacherCourseInfo';
import Listeners from './src/pages/Teacher/Listeners';
import StudentCourse from './src/pages/Student/StudentCourse';
import StudentCourseInfo from './src/pages/Student/StudentCourseInfo';
import Study from './src/pages/Student/Study';
import StudyIn from './src/pages/Student/StudyIn';
import StudyOut from './src/pages/Student/StudyOut';
import StudyWeb from './src/pages/Student/StudyWeb';
import StudyTime from './src/pages/Student/StudyTime';
import Attendance from './src/pages/Attendance';
import MyAttendance from './src/pages/MyAttendance';
import StudentAttendance from './src/pages/Student/StudentAttendance';
import QRCodeScanner from './src/pages/Student/QRCodeScanner';
import AttendanceWeb from './src/pages/Student/AttendanceWeb';
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import reducer, {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useCallback, useEffect, useReducer, useState} from 'react';
import {Fonts} from './src/assets/Fonts';
import SplashScreen from 'react-native-splash-screen';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import {useAppDispatch} from './src/store';
import MyPointList from './src/pages/MyPointList';
import AllRanking from './src/pages/AllRanking';
import MyPage from './src/pages/MyPage';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import TeacherMain from './src/pages/Teacher/TeacherMain';
import NewPassword from './src/pages/NewPassword';
import BoardList from './src/pages/BoardList';
import BoardSave from './src/pages/BoardSave';
import BoardDetail from './src/pages/BoardDetail';
import BoardUpdate from './src/pages/BoardUpdate';
import SHomeworkList from './src/pages/SHomeworkList';
import StudentBoardList from './src/pages/StudentBoardList';
import StudentBoardDetail from './src/pages/StudentBoardDetail';
import StudentHomework from './src/pages/StudentHomework';
import VideoList from './src/pages/Teacher/VideoList';
import AttendanceInfo from './src/pages/Student/AttendanceInfo';
import VideoAuth from './src/pages/Student/VideoAuth';
import ApplyVideo from './src/pages/Teacher/ApplyVideo';
import StudentTestMain from './src/pages/Student/StudentTestMain';
import StudentTestResult from './src/pages/Student/StudentTestResult';
import StudentAllTestResult from './src/pages/Student/StudentAllTestResult';
import TeacherAllTest from './src/pages/Teacher/TeacherAllTest';
import TeacherTest from './src/pages/Teacher/TeacherTest';
import TestRank from './src/pages/Teacher/TestRank';
import messaging from '@react-native-firebase/messaging';
// import isMockFunction = jest.isMockFunction;

export type LoggedInParamList = {
  Welcome: undefined;
  Main: undefined;
  Ranking: undefined;
  MyPointList: undefined;
  AllRanking: undefined;
  MyPage: undefined;
  TeacherMain: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUpAuth: undefined;
  SignUp: {phoneNumber: string};
  NewPassword: undefined;
};

const Stack = createNativeStackNavigator();

let b = true;

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.phoneNumber,
  );
  const isProfile = useSelector((state: RootState) => !!state.user.nickname);
  const authority = useSelector((state: RootState) => state.user.authority);
  console.log('으아가ㅏ아갇아가가ㅏ아ㅏ가가ㅏ아가: ', authority);
  const access = useSelector((state: RootState) => state.user.accessToken);
  const deviceToken = useSelector((state: RootState) => state.user.deviceToken);

  // const changeA = () => {
  //   setAuthority1(a => !a);
  //
  // };
  console.log(access);
  console.log('isLoggedIn', isLoggedIn);

  const [socket, disconnect] = useSocket();

  // useEffect(() => {
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 500);
  // }, []);

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        console.log(
          'refreshToken: ',
          refreshToken,
          '\naccessToken: ',
          accessToken,
        );
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('phone token', token);
        dispatch(userSlice.actions.setDeviceToken({deviceToken: token}));

        if (!(refreshToken && accessToken)) {
          SplashScreen.hide();
          return;
        }
        const responseT = await axios.post(
          `${Config.API_URL}/auth/refreshToken`, // 토큰 정보 리턴
          {accessToken, refreshToken},
        );
        console.log(responseT.data);
        console.log('등급???????: ', responseT.data.authority);
        // setA(prev => {
        //   return {...prev, a: responseT.data.authority};
        // });
        // console.log('되라 쫌!!!!!!!!!1: ', a.a);

        dispatch(
          userSlice.actions.setAccessToken({
            accessToken: responseT.data.accessToken,
          }),
        );
        dispatch(
          userSlice.actions.setAuthority({
            authority: responseT.data.authority,
          }),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          responseT.data.refreshToken,
        );
        await EncryptedStorage.setItem(
          'accessToken',
          responseT.data.accessToken,
        );

        // console.log('선생님? 학생?: ', authority1);
        // console.log('선생님? 학생?: ', authority);
        console.log('셀렉터: ', access);

        const newAccessToken = await EncryptedStorage.getItem('accessToken');

        console.log('response 받은 거: ', responseT.data.accessToken);
        console.log('로컬에서 꺼내온 거: ', newAccessToken);
        console.log('셀렉터: ', access);

        if (responseT.data.authority === 'ROLE_USER') {
          const response = await axios.get(`${Config.API_URL}/member/me`, {
            params: {},
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          console.log(response.data);
          dispatch(
            userSlice.actions.setUser({
              phoneNumber: response.data.phoneNumber,
              nickname: response.data.nickname,
              photoURL: response.data.photoURL,
            }),
          );
          console.log(response.data);
        } else {
          const response = await axios.get(`${Config.API_URL}/member/teacher`, {
            params: {},
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          console.log(response.data);
          dispatch(
            userSlice.actions.setTeacher({
              phoneNumber: response.data.phoneNumber,
              name: response.data.name,
            }),
          );
          console.log(response.data);
        }

        // .then(() => {
        //   EncryptedStorage.getItem('accessToken', (err, result) => {
        //     fetch(`${Config.API_URL}/member/me`, {
        //       method: 'GET',
        //       headers: {
        //         Authorization: `Bearer ${result}`,
        //       },
        //     })
        //       .then(response => response.json())
        //       .then(json =>
        //         dispatch(
        //           userSlice.actions.setUser({
        //             // accessToken: response.data.accessToken,
        //             phoneNumber: json.phoneNumber,
        //             nickname: json.data.nickname,
        //             photoURL: json.data.photoURL,
        //           }),
        //         ),
        //       );
        //   });
        // });
      } catch (error) {
        await EncryptedStorage.clear();
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  console.log('b 변경 함수 밖:     ', b);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  // useEffect(() => {
  //   axios.interceptors.response.use(
  //     response => {
  //       return response;
  //     },
  //     async error => {
  //       const {
  //         config,
  //         response: {status},
  //       } = error;
  //       if (status === 419) {
  //         if (error.response.data.code === 'expired') {
  //           const originalRequest = config;
  //           const refreshToken = await EncryptedStorage.getItem('refreshToken');
  //           const accessToken = await EncryptedStorage.getItem('accessToken');
  //           // token refresh 요청
  //           const res = await axios.post(
  //             `${Config.API_URL}/auth/refreshToken`, // token refresh api
  //             {refreshToken, accessToken},
  //           );
  //           // 새로운 토큰 저장
  //           dispatch(userSlice.actions.setAccessToken(res.data.accessToken));
  //           await EncryptedStorage.setItem(
  //             'refreshToken',
  //             res.data.refreshToken,
  //           );
  //           await EncryptedStorage.setItem('accessToken', res.data.accessToken);
  //           originalRequest.headers.authorization = `Bearer ${res.data.accessToken}`;
  //           // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
  //           return axios(originalRequest);
  //         }
  //       }
  //       return Promise.reject(error);
  //     },
  //   );
  // }, [dispatch]);

  useEffect(() => {
    const helloCallback = (data: any) => {
      console.log(data);
      dispatch(courseSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit('login', 'hello');
      socket.on('hello', helloCallback);
    }
    return () => {
      if (socket) {
        socket.off('hello', helloCallback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  const LoginNavigator = ({navigation}) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: '로그인', headerShown: false}}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{
            title: '비밀번호 변경',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="SignUpAuth"
          component={SignUpAuth}
          options={{
            title: '전화번호 인증',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            title: '회원가입',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const StudentScreenNavigator = ({navigation}) => {
    return !isProfile ? (
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{title: '', headerShown: false}}
        />
      </Stack.Navigator>
    ) : (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{title: '메인', headerShown: false}}
        />
        <Stack.Screen
          name="Ranking"
          component={Ranking}
          options={{title: '랭킹'}}
        />
        <Stack.Screen
          name="MyPointList"
          component={MyPointList}
          options={{title: '나의 누적 포인트'}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{title: '마이페이지'}}
        />
        <Stack.Screen
          name="StudentCourse"
          component={StudentCourse}
          options={{title: '강의', headerShown: true}}
        />
        <Stack.Screen
          name="StudentCourseInfo"
          component={StudentCourseInfo}
          options={{title: '학생 정보', headerShown: true}}
        />

        <Stack.Screen
          name="QRCodeScanner"
          component={QRCodeScanner}
          options={{title: 'QRcode', headerShown: false}}
        />

        <Stack.Screen
          name="AttendanceWeb"
          component={AttendanceWeb}
          options={{title: 'AttendanceWeb', headerShown: true}}
        />
        <Stack.Screen
          name="MyAttendance"
          component={MyAttendance}
          options={{title: '출석현황'}}
        />
        <Stack.Screen
          name="StudentBoardList"
          component={StudentBoardList}
          options={{title: '과제 리스트'}}
        />
        <Stack.Screen
          name="StudentBoardDetail"
          component={StudentBoardDetail}
          options={{title: '과제 상세보기'}}
        />
        <Stack.Screen
          name="StudentHomework"
          component={StudentHomework}
          options={{title: '과제 제출확인 현황'}}
        />
        <Stack.Screen
          name="Study"
          component={Study}
          options={{title: '자습', headerShown: true}}
        />
        <Stack.Screen
          name="StudyIn"
          component={StudyIn}
          options={{title: '입실', headerShown: false}}
        />
        <Stack.Screen
          name="StudyOut"
          component={StudyOut}
          options={{title: '퇴실', headerShown: false}}
        />
        <Stack.Screen
          name="StudyWeb"
          component={StudyWeb}
          options={{title: '자습 웹', headerShown: false}}
        />
        <Stack.Screen
          name="StudyTime"
          component={StudyTime}
          options={{title: '자습시간', headerShown: false}}
        />
        <Stack.Screen
          name="AttendanceInfo"
          component={AttendanceInfo}
          options={{title: '출석', headerShown: true}}
        />
        <Stack.Screen
          name="VideoList"
          component={VideoList}
          options={{title: '동영상 신청', headerShown: true}}
        />
        <Stack.Screen
          name="VideoAuth"
          component={VideoAuth}
          options={{title: '부모님 인증', headerShown: true}}
        />
        <Stack.Screen
          name="StudentTestMain"
          component={StudentTestMain}
          options={{title: '내 테스트', headerShown: true}}
        />
        <Stack.Screen
          name="StudentTestResult"
          component={StudentTestResult}
          options={{title: '테스트 결과', headerShown: true}}
        />
        <Stack.Screen
          name="StudentAllTestResult"
          component={StudentAllTestResult}
          options={{title: '전회차 분석', headerShown: true}}
        />
      </Stack.Navigator>
    );
  };

  const TeacherScreenNavigator = navigation => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="TeacherMain"
          component={TeacherMain}
          options={{title: 'TeacherMain', headerShown: true}}
        />
        <Stack.Screen
          name="TeacherCourse"
          component={TeacherCourse}
          options={{title: '내 강의', headerShown: true}}
        />
        <Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{title: '수업 출석부'}}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendance}
          options={{title: '강의'}}
        />
        <Stack.Screen
          name="TeacherCourseInfo"
          component={TeacherCourseInfo}
          options={{title: '강의정보'}}
        />
        <Stack.Screen
          name="BoardList"
          component={BoardList}
          options={{title: '과제 리스트'}}
        />
        <Stack.Screen
          name="BoardSave"
          component={BoardSave}
          options={{title: '과제 작성'}}
        />
        <Stack.Screen
          name="BoardUpdate"
          component={BoardUpdate}
          options={{title: '과제 작성'}}
        />
        <Stack.Screen
          name="BoardDetail"
          component={BoardDetail}
          options={{title: '과제 상세보기'}}
        />
        <Stack.Screen
          name="SHomeworkList"
          component={SHomeworkList}
          options={{title: '수강생 체크리스트'}}
        />
        <Stack.Screen
          name="Listeners"
          component={Listeners}
          options={{title: '수강생'}}
        />
        <Stack.Screen
          name="AllRanking"
          component={AllRanking}
          options={{title: '전체 랭킹'}}
        />
        <Stack.Screen
          name="ApplyVideo"
          component={ApplyVideo}
          options={{title: '동영상신청리스트', headerShown: true}}
        />
        <Stack.Screen
          name="TeacherAllTest"
          component={TeacherAllTest}
          options={{title: '테스트', headerShown: true}}
        />
        <Stack.Screen
          name="TeacherTest"
          component={TeacherTest}
          options={{title: '테스트', headerShown: true}}
        />
        <Stack.Screen
          name="TestRank"
          component={TestRank}
          options={{title: '순위', headerShown: true}}
        />
      </Stack.Navigator>
    );
  };

  console.log('삐이이이이잉이: ', authority);
  return !isLoggedIn ? (
    <LoginNavigator />
  ) : authority !== 'ROLE_USER' ? (
    // <Stack.Navigator>
    //   <Stack.Screen
    //     name="SignIn"
    //     component={SignIn}
    //     options={{title: '로그인', headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="SignUpAuth"
    //     component={SignUpAuth}
    //     options={{
    //       title: '전화번호 인증',
    //       headerTitleStyle: {
    //         fontFamily: Fonts.TRBold,
    //         fontSize: 22,
    //       },
    //     }}
    //   />
    //   <Stack.Screen
    //     name="SignUp"
    //     component={SignUp}
    //     options={{
    //       title: '회원가입',
    //       headerTitleStyle: {
    //         fontFamily: Fonts.TRBold,
    //         fontSize: 22,
    //       },
    //     }}
    //   />
    // </Stack.Navigator>
    // !isProfile ? (
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       name="Welcome"
    //       component={Welcome}
    //       options={{title: '', headerShown: false}}
    //     />
    //   </Stack.Navigator>
    // ) : (
    // <Stack.Navigator>
    //   <Stack.Screen
    //     name="Main"
    //     component={Main}
    //     options={{title: '메인', headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="Ranking"
    //     component={Ranking}
    //     options={{title: '랭킹'}}
    //   />
    //   <Stack.Screen
    //     name="MyPointList"
    //     component={MyPointList}
    //     options={{title: '나의 누적 포인트'}}
    //   />
    //   <Stack.Screen
    //     name="AllRanking"
    //     component={AllRanking}
    //     options={{title: '전체 랭킹'}}
    //   />
    //   <Stack.Screen
    //     name="MyPage"
    //     component={MyPage}
    //     options={{title: '마이페이지'}}
    //   />
    //   <Stack.Screen
    //     name="TeacherCourse"
    //     component={TeacherCourse}
    //     options={{title: '내 강의', headerShown: true}}
    //   />
    //   <Stack.Screen
    //     name="CourseInfo"
    //     component={CourseInfo}
    //     options={{title: '강의', headerShown: true}}
    //   />
    //   <Stack.Screen
    //     name="StudentInfo"
    //     component={StudentInfo}
    //     options={{title: '학생 정보', headerShown: true}}
    //   />
    //   <Stack.Screen
    //     name="Attendance"
    //     component={Attendance}
    //     options={{title: '수업 출석부'}}
    //   />
    //   <Stack.Screen
    //     name="StudentAttendance"
    //     component={StudentAttendance}
    //     options={{title: '출석부'}}
    //   />
    //   <Stack.Screen
    //     name="QRCodeScanner"
    //     component={QRCodeScanner}
    //     options={{title: 'QRcode', headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="AttendanceWeb"
    //     component={AttendanceWeb}
    //     options={{title: 'AttendanceWeb', headerShown: true}}
    //   />
    // </Stack.Navigator>
    <TeacherScreenNavigator />
  ) : (
    <StudentScreenNavigator />
  );
}

export default AppInner;
