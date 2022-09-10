import React, {useEffect} from 'react';
import Title from '../../components/Title';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Box} from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../../assets/Fonts';
import {width, height} from '../../config/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';

type StudentCourseInfoScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentCourseInfo'
>;

function StudentCourseInfo({route, navigation}: StudentCourseInfoScreenProps) {
  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Title title={route.params.cname} />
        <View style={styles.buttonArea}>
          <RNBounceable
            onPress={() => navigation.navigate('MyAttendance', route.params)}>
            <Box
              style={styles.button}
              // maxW="96"
              borderWidth="1"
              borderColor="darkBlue.300"
              shadow="3"
              bg="darkBlue.200"
              p="5"
              rounded="8">
              <Text style={styles.buttonText}>내 출석 현황</Text>
              <FontAwesome5Icon
                name={'caret-right'}
                size={width * 50}
                color={'black'}
                style={{
                  position: 'absolute',
                  bottom: height * 10,
                  right: width * 20,
                }}
              />
            </Box>
          </RNBounceable>
        </View>
        <View style={styles.buttonArea}>
          <RNBounceable
            onPress={() =>
              navigation.navigate('StudentBoardList', {
                courseId: route.params.id,
              })
            }>
            <Box
              style={styles.button}
              // maxW="96"
              borderWidth="1"
              borderColor="warning.400"
              shadow="3"
              bg="warning.300"
              p="5"
              rounded="8">
              <Text style={styles.buttonText}>과제</Text>
              <FontAwesome5Icon
                name={'caret-right'}
                size={width * 50}
                color={'black'}
                style={{
                  position: 'absolute',
                  bottom: height * 10,
                  right: width * 20,
                }}
              />
            </Box>
          </RNBounceable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  buttonContainer: {
    // backgroundColor: 'blue',
    flex: 1,
    marginTop: '15%',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    // width: '50%',
    height: '90%',
    marginTop: height * 10,
    marginHorizontal: width * 20,
    // marginBottom: 10,
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
        elevation: 5,
      },
    }),
  },
  buttonText: {
    marginHorizontal: width * 10,
    marginVertical: height * 10,
    color: 'black',
    fontFamily: Fonts.TRBold,
    fontSize: width * 40,
    // mt="3" fontWeight="medium" fontSize="xl"
  },
});

export default StudentCourseInfo;
