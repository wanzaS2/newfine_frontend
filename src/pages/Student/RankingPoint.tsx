import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import {Fonts} from '../../assets/Fonts';
// import {Switch} from 'native-base';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AllRanking from './AllRanking';
import MyPointList from './MyPointList';
import {width, height} from '../../config/globalStyles';

function RankingPoint() {
  // const [textColor, setTextColor] = useState('#000');
  const [value, setValue] = useState('포인트 내역');
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      return <MyPointList />;
    } else if (selectedIndex === 1) {
      return <AllRanking />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*<ScrollView stickyHeaderIndices={[0]}>*/}
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={{
            height: height * 50,
            backgroundColor: 'lightgray',
          }}
          tintColor="darkblue"
          values={['포인트 내역', '전체 랭킹']}
          selectedIndex={selectedIndex}
          onChange={_onChange}
          onValueChange={_onValueChange}
          fontStyle={{fontSize: width * 16}}
          activeFontStyle={{fontSize: width * 17}}
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
      {/*</ScrollView>*/}
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
    paddingBottom: height * 10,
    paddingTop: height * 20,
    paddingHorizontal: width * 10,
  },
  listArea: {
    // backgroundColor: 'yellow',
    alignItem: 'center',
    justifyContent: 'center',
  },
  flatList: {
    // width: screenWidth,
    height: height * 60,
    alignItems: 'center',
    // marginTop: 5,
    justifyContent: 'center',
    marginBottom: height * 10,
    borderRadius: 8,
    backgroundColor: '#bae6fd',
    marginHorizontal: width * 10,
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
        elevation: 3,
      },
    }),
  },
});
export default RankingPoint;
