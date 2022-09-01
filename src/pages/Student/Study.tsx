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

type StudyScreenProps = NativeStackScreenProps<LoggedInParamList, 'Study'>;

function Study({navigation}: StudyScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonArea}>
          <Pressable
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
                size={50}
                color={'black'}
                style={{position: 'absolute', bottom: 10, right: 20}}
              />
            </Box>
          </Pressable>
        </View>
        <View style={styles.buttonArea}>
          <Pressable
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
                size={50}
                color={'black'}
                style={{position: 'absolute', bottom: 10, right: 20}}
              />
            </Box>
          </Pressable>
        </View>
        <View style={styles.buttonArea}>
          <Pressable
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
                size={50}
                color={'black'}
                style={{position: 'absolute', bottom: 10, right: 20}}
              />
            </Box>
          </Pressable>
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
    marginHorizontal: 20,
    // marginBottom: 10,
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
        elevation: 5,
      },
    }),
  },
  buttonText: {
    margin: 10,
    color: 'black',
    fontFamily: Fonts.TRBold,
    fontSize: 40,
    // mt="3" fontWeight="medium" fontSize="xl"
  },
});

export default Study;
