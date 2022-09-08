import React, {useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import teacherCourseInfo from '../../assets/mock/teacherCourseInfo.json';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TeacherParamList} from '../../../AppInner';
import {Fonts} from '../../assets/Fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type TeacherCourseInfoScreenProps = NativeStackScreenProps<
  TeacherParamList,
  'TeacherCourseInfo'
>;

const screenHeight = Dimensions.get('window').height;

function TeacherCourseInfo({route, navigation}: TeacherCourseInfoScreenProps) {
  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.courseArea}>
        <Text style={styles.courseName}> #{route.params.cname}</Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{
            // marginTop: 10,
            flex: 1,
            // backgroundColor: 'yellow',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          data={teacherCourseInfo}
          renderItem={({item, index}) => (
            <View style={styles.buttonArea}>
              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate(item.onPress, route.params)}>
                <View style={{alignItems: 'center'}}>
                  <FontAwesome5Icon
                    name={item.icon}
                    size={50}
                    color={'white'}
                    style={{position: 'absolute', bottom: 5}}
                  />
                  <Text style={styles.buttonText}>{item.name} </Text>
                </View>
              </Pressable>
            </View>
          )}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  courseArea: {
    marginTop: '3%',
    marginLeft: '40%',
    paddingBottom: '5%',
    // flex: 1,
    // backgroundColor: 'blue',
  },
  buttonArea: {
    marginHorizontal: 10,
    marginVertical: 10,
    // marginVertical: 30,
    width: '45%',
    height: 270,
    // backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#fb923c',
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
        elevation: 7,
      },
    }),
  },
  buttonText: {
    marginTop: 10,
    fontSize: 25,
    fontFamily: Fonts.TRBold,
    color: 'white',
    lineHeight: 33,
    position: 'absolute',
    top: 5,
  },
  courseName: {
    fontSize: 23,
    fontFamily: Fonts.TRBold,
    color: '#0077e6',
    // backgroundColor: 'lightyellow',
    // marginRight: 250,
  },
});

export default TeacherCourseInfo;
