import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import SignUpAuth from './src/pages/SignUpAuth';
import StudentMain from './src/pages/Student/StudentMain';
import Welcome from './src/pages/Student/Welcome';
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
import Attendance from './src/pages/Teacher/Attendance';
import MyAttendance from './src/pages/Student/MyAttendance';
import StudentAttendance from './src/pages/Teacher/StudentAttendance';
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
import RankingPoint from './src/pages/Student/RankingPoint';
import AllRanking from './src/pages/Student/AllRanking';
import MyPage from './src/pages/Student/MyPage';

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import TeacherMain from './src/pages/Teacher/TeacherMain';
import NewPassword from './src/pages/NewPassword';
import BoardList from './src/pages/Teacher/BoardList';
import SHomeworkList from './src/pages/Teacher/SHomeworkList';
import StudentBoardList from './src/pages/Student/StudentBoardList';
import StudentHomework from './src/pages/Student/StudentHomework';
import VideoList from './src/pages/Student/VideoList';
import AttendanceInfo from './src/pages/Student/AttendanceInfo';
import VideoAuth from './src/pages/Student/VideoAuth';
import ApplyVideo from './src/pages/Teacher/ApplyVideo';
import StudentTestMain from './src/pages/Student/StudentTestMain';
import StudentTestResult from './src/pages/Student/StudentTestResult';
import {NativeBaseProvider} from 'native-base';
import StudentAllTestResult from './src/pages/Student/StudentAllTestResult';
import TeacherAllTest from './src/pages/Teacher/TeacherAllTest';
import TeacherTest from './src/pages/Teacher/TeacherTest';
import TestRank from './src/pages/Teacher/TestRank';
import TeacherRanking from './src/pages/Teacher/TeacherRanking';
import MyPointList from './src/pages/Student/MyPointList';
import messaging from '@react-native-firebase/messaging';
// 푸시알림 추가할 것!!
// import isMockFunction = jest.isMockFunction;

export type LoggedInParamList = {
  Welcome: undefined;
  StudentMain: undefined;
  RankingPoint: undefined;
  AllRanking: undefined;
  MyPointList: undefined;
  MyPage: undefined;
  StudentCourse: undefined;
  StudentCourseInfo: undefined;
  AttendanceInfo: undefined;
  QRCodeScanner: undefined;
  VideoList: undefined;
  VideoAuth: undefined;
  Study: undefined;
  StudyIn: undefined;
  StudyOut: undefined;
  StudyTime: undefined;
  StudentTestMain: undefined;
  StudentTestResult: undefined;
  StudentAllTestResult: undefined;
  MyAttendance: undefined;
  StudentBoardList: undefined;
  StudentHomework: undefined;
  CarouselPage1: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUpAuth: undefined;
  SignUp: {phoneNumber: string};
  NewPassword: undefined;
};

export type TeacherParamList = {
  TeacherMain: undefined;
  TeacherCourse: undefined;
  TeacherCourseInfo: undefined;
  Listeners: undefined;
  Attendance: undefined;
  StudentAttendance: undefined;
  TeacherAllTest: undefined;
  TeacherTest: undefined;
  TestRank: undefined;
  TeacherRanking: undefined;
  ApplyVideo: undefined;
  BoardList: {courseId: number};
  SHomeworkList: {thId: number; courseName: string};
};

const Stack = createNativeStackNavigator();
// const BottomTab = createBottomTabNavigator();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.phoneNumber,
  );
  const isProfile = useSelector((state: RootState) => !!state.user.nickname);
  const authority = useSelector((state: RootState) => state.user.authority);
  const access = useSelector((state: RootState) => state.user.accessToken);
  const deviceToken = useSelector((state: RootState) => state.user.deviceToken); //푸시알림 추가할 것 !!

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
        //if문 부터 푸시알림 추가할 것 !!!!
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

        const newAccessToken = await EncryptedStorage.getItem('accessToken');

        // ** 나중에 지우기
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
          name="StudentMain"
          component={StudentMain}
          options={{title: '메인', headerShown: false}}
        />
        <Stack.Screen
          name="RankingPoint"
          component={RankingPoint}
          options={{title: '', headerShown: false}}
        />
        <Stack.Screen
          name="AllRanking"
          component={AllRanking}
          options={{title: '', headerShown: false}}
        />
        <Stack.Screen
          name="MyPointList"
          component={MyPointList}
          options={{title: '', headerShown: false}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{
            title: '',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentCourse"
          component={StudentCourse}
          options={{
            title: '내 수업',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentCourseInfo"
          component={StudentCourseInfo}
          options={{
            title: '수업 정보',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
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
          options={{
            title: '출석 현황',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentBoardList"
          component={StudentBoardList}
          options={{
            title: '과제 리스트',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentHomework"
          component={StudentHomework}
          options={{
            title: '과제 현황',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Study"
          component={Study}
          options={{
            title: '자습',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
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
          options={{
            title: '내 자습 현황',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="AttendanceInfo"
          component={AttendanceInfo}
          options={{
            title: '출석',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="VideoList"
          component={VideoList}
          options={{
            title: '동영상 신청',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="VideoAuth"
          component={VideoAuth}
          options={{
            title: '학부모님 인증',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentTestMain"
          component={StudentTestMain}
          options={{
            title: '내 테스트',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentTestResult"
          component={StudentTestResult}
          options={{
            title: '테스트 결과',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            // headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentAllTestResult"
          component={StudentAllTestResult}
          options={{
            title: '전회차 분석',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            // headerTransparent: true
          }}
        />
      </Stack.Navigator>
    );
  };

  const TeacherScreenNavigator = ({navigation}) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="TeacherMain"
          component={TeacherMain}
          options={{title: 'TeacherMain', headerShown: false}}
        />
        <Stack.Screen
          name="TeacherCourse"
          component={TeacherCourse}
          options={{
            title: '내 강의',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{
            title: '수업 출석부',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendance}
          options={{
            title: '출석 체크',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TeacherCourseInfo"
          component={TeacherCourseInfo}
          options={{
            title: '강의 정보',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="BoardList"
          component={BoardList}
          options={{
            title: '과제 리스트',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="SHomeworkList"
          component={SHomeworkList}
          options={{
            title: '과제 체크',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Listeners"
          component={Listeners}
          options={{
            title: '수강생 리스트',
            headerShown: true,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TeacherRanking"
          component={TeacherRanking}
          options={{
            title: '학생 랭킹',
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ApplyVideo"
          component={ApplyVideo}
          options={{
            title: '동영상 신청 리스트',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TeacherAllTest"
          component={TeacherAllTest}
          options={{
            title: '테스트',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TeacherTest"
          component={TeacherTest}
          options={{
            title: '테스트 분석',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TestRank"
          component={TestRank}
          options={{
            title: '테스트 랭킹',
            headerShown: true,
            headerTitleStyle: {
              fontFamily: Fonts.TRBold,
              fontSize: 22,
            },
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NativeBaseProvider>
      {!isLoggedIn ? (
        <LoginNavigator />
      ) : authority !== 'ROLE_USER' ? (
        <TeacherScreenNavigator />
      ) : (
        <StudentScreenNavigator />
      )}
    </NativeBaseProvider>
  );
}

export default AppInner;
