import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import {Box} from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {width, height} from '../../config/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';

type StudyScreenProps = NativeStackScreenProps<LoggedInParamList, 'Study'>;

function Study({navigation}: StudyScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonArea}>
          <RNBounceable
            onPress={() => {
              navigation.navigate('StudyIn');
            }}>
            <Box
              style={styles.button}
              // maxW="96"
              borderWidth="1"
              borderColor="darkBlue.300"
              shadow="3"
              bg="darkBlue.200"
              p="5"
              rounded="8">
              <Text style={styles.buttonText}>입실</Text>
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
            onPress={() => {
              navigation.navigate('StudyOut');
            }}>
            <Box
              style={styles.button}
              // maxW="96"
              borderWidth="1"
              borderColor="warning.400"
              shadow="3"
              bg="warning.300"
              p="5"
              rounded="8">
              <Text style={styles.buttonText}>퇴실</Text>
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
            onPress={() => {
              navigation.navigate('StudyTime');
            }}>
            <Box
              style={styles.button}
              // maxW="96"
              borderWidth="1"
              borderColor="red.400"
              shadow="3"
              bg="red.300"
              p="5"
              rounded="8">
              <Text style={styles.buttonText}>총 자습 시간</Text>
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
    flex: 1,
    marginTop: '12%',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    // paddingBottom: 10,
  },
  button: {
    // width: '50%',
    height: '95%',
    // marginTop: 10,
    marginHorizontal: width * 20,
    // marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: width * 5,
          height: height * 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
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

export default Study;
