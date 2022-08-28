import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Text,
  Alert,
  StyleSheet,
  useColorScheme,
  Platform,
  ScrollView,
} from 'react-native';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/reducer';
import {useFocusEffect} from '@react-navigation/native';
import {Fonts} from '../../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../../AppInner';
// import {Switch} from 'native-base';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import AllRanking from './AllRanking';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

type MyPointListScreenProps = NativeStackScreenProps<
  LoggedInParamList,
  'MyPointList'
>;

function MyPointList({navigation}: MyPointListScreenProps) {
  const colorScheme = useColorScheme();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [pointInfo, setPointInfo] = useState([]);
  // const [textColor, setTextColor] = useState('#000');
  const [value, setValue] = useState('포인트 내역');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sorting, setSorting] = useState('pointDesc');
  const scrollRef = useRef();

  const _onChange = event => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };
  const _onValueChange = val => {
    setValue(val);
    console.log(val);
  };
  // useEffect(() => {
  //   setTextColor(colorScheme === 'dark' ? '#FFF' : '#000');
  // }, [colorScheme]);

  const showList = () => {
    if (selectedIndex === 0) {
      return (
        <View style={styles.listArea}>
          <FlatList
            ref={scrollRef}
            data={pointInfo}
            keyExtractor={(item, index) => {
              return `pointHistory-${index}`;
            }}
            renderItem={({item, index}) => (
              <View style={styles.flatList}>
                <Text style={styles.textTop}>
                  {item.date} | {item.time} | {item.contents} | {item.score}점
                </Text>
                <Text style={styles.textBottom}>
                  누적 포인트 : {item.scoreSum}
                </Text>
              </View>
            )}
          />
        </View>
      );
    } else if (selectedIndex === 1) {
      return <AllRanking />;
    }
  };

  const getPointHistory = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/point/${sorting}`, {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(accessToken);

      let list = [];
      for (let i = 0; i < response.data.data.length; i++) {
        list.push({
          contents: response.data.data[i].contents,
          date: response.data.data[i].date.substr(0, 10),
          time: response.data.data[i].date.substr(11, 5),
          score: response.data.data[i].score,
          scoreSum: response.data.data[i].scoreSum,
        });
      }

      console.log(list);
      setPointInfo(list);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPointHistory();
    }, []),
  );

  useEffect(() => {
    getPointHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View style={styles.segmentContainer}>
          <SegmentedControl
            style={{
              height: 50,
              backgroundColor: 'lightgray',
            }}
            tintColor="darkblue"
            values={['포인트 내역', '전체 랭킹']}
            selectedIndex={selectedIndex}
            onChange={_onChange}
            onValueChange={_onValueChange}
            fontStyle={{fontSize: 16}}
            activeFontStyle={{fontSize: 17}}
          />
        </View>
        {showList()}
        {/*<Switch*/}
        {/*  size="lg"*/}
        {/*  offTrackColor="orange.200"*/}
        {/*  onTrackColor="darkBlue.100"*/}
        {/*  onThumbColor="darkBlue.500"*/}
        {/*  offThumbColor="orange.500"*/}
        {/*  onToggle={() => {*/}
        {/*    showImage();*/}
        {/*  }}*/}
        {/*  defaultIsChecked={false}*/}
        {/*/>*/}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  textTop: {fontFamily: Fonts.TRRegular, fontSize: 13},
  textBottom: {fontFamily: Fonts.TRBold, fontSize: 17, color: 'black'},
  segmentContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  listArea: {
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    height: 60,
    alignItems: 'center',
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
});
export default MyPointList;
