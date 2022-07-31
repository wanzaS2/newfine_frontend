import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import SignUpAuth from './src/pages/SignUpAuth';
import Ranking from './src/pages/Ranking';
import Main from './src/pages/Main';
import Welcome from './src/pages/Welcome';
import TeacherCourse from './src/pages/TeacherCourse';
import CourseInfo from './src/pages/CourseInfo';
import Attendance from './src/pages/Attendance';
import StudentAttendance from './src/pages/StudentAttendance';
import StudentInfo from './src/pages/StudentInfo';
import QRCodeScanner from './src/pages/QRCodeScanner';
import AttendanceWeb from './src/pages/AttendanceWeb';
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
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
import TeacherMain from './src/pages/TeacherMain';

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
};

const Stack = createNativeStackNavigator();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.phoneNumber,
  );
  const isProfile = useSelector((state: RootState) => !!state.user.nickname);
  const authority = useSelector((state: RootState) => !!state.user.authority);
  const access = useSelector((state: RootState) => state.user.accessToken);
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
        if (!(refreshToken && accessToken)) {
          SplashScreen.hide();
          return;
        }
        const responseT = await axios.post(
          `${Config.API_URL}/auth/refreshToken`, // 토큰 정보 리턴
          {accessToken, refreshToken},
        );
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

        console.log('셀렉터: ', access);

        const newAccessToken = await EncryptedStorage.getItem('accessToken');

        console.log('response 받은 거: ', responseT.data.accessToken);
        console.log('로컬에서 꺼내온 거: ', newAccessToken);
        console.log('셀렉터: ', access);

        if (authority === 'ROLE_USER') {
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
              Authorization: `Bearer ${accessToken}`,
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

        console.log(responseT.data);
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
          name="AllRanking"
          component={AllRanking}
          options={{title: '전체 랭킹'}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{title: '마이페이지'}}
        />
        <Stack.Screen
          name="CourseInfo"
          component={CourseInfo}
          options={{title: '강의', headerShown: true}}
        />
        <Stack.Screen
          name="StudentInfo"
          component={StudentInfo}
          options={{title: '학생 정보', headerShown: true}}
        />
        <Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{title: '수업 출석부'}}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendance}
          options={{title: '출석부'}}
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
      </Stack.Navigator>
    );
  };

  return !isLoggedIn ? (
    <LoginNavigator />
  ) : authority != 'ROLE_ADMIN' ? (
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
