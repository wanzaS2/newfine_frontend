import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LoggedInParamList} from '../../../AppInner';
import axios from 'axios';
import Config from 'react-native-config';
// import Title from '../../components/Title';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Fonts} from '../../assets/Fonts';

type StudentTestMainScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'StudentTestMain'
>;

function StudentTestMain({route, navigation}: StudentTestMainScreenProps) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [TestList, setTestList] = useState();
  const [listLength, setAttendanceLength] = useState();

  const getTests = () => {
    console.log(route.params);
    axios(`${Config.API_URL}/test/all/my`, {
      params: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        response.data.sort((a, b) => (a.testDate < b.testDate ? 1 : -1));
        setTestList(response.data);
        setAttendanceLength(response.data.length);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    getTests();
    console.log('AttendanceList : ', TestList);
    console.log('listLength : ', listLength);
  }, [listLength]);
  return (
    <SafeAreaView style={styles.container}>
      {/*<StatusBar style="auto" />*/}
      {/*<Title title="내 테스트" />*/}
      <View style={styles.listArea}>
        <FlatList
          data={TestList}
          renderItem={({item, index}) => (
            <Pressable
              onPress={() => navigation.navigate('StudentTestResult', item.id)}>
              <View style={styles.flatList}>
                <Text style={styles.classText}>{item.testName}</Text>
                <Text style={styles.dateText}>{item.testDate.slice(5)}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={item => String(item.id)}
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
  listArea: {
    marginTop: '15%',
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    paddingVertical: '4%',
    // alignItems: 'center',
    // marginTop: 5,
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
  classText: {
    marginLeft: '5%',
    fontSize: 20,
    fontFamily: Fonts.TRBold,
    color: 'black',
  },
  dateText: {
    position: 'absolute',
    right: 15,
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'gray',
  },
});

export default StudentTestMain;
