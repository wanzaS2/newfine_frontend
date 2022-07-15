import React from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList, RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import SetUpProfile from '../components/SetUpProfile';
import {Fonts} from '../assets/Fonts';
import Ranking from './Ranking';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function Main() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        <Pressable>
          <Text>랭킹</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <LinearGradient colors={['pink', 'mistyrose']} style={styles.block}>
            <Pressable>
              <View>
                <Text style={styles.blockTitle}>수업</Text>
              </View>
            </Pressable>
          </LinearGradient>
          <LinearGradient colors={['plum', 'lavender']} style={styles.block}>
            <Pressable>
              <Text style={styles.blockTitle}>출석</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient
            colors={['palegreen', 'honeydew']}
            style={styles.block}>
            <Pressable>
              <Text style={styles.blockTitle}>과제</Text>
            </Pressable>
          </LinearGradient>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Pressable style={styles.block}>
            <Text style={styles.blockTitle}>자습</Text>
          </Pressable>
          <Pressable style={styles.block}>
            <Text style={styles.blockTitle}>테스트</Text>
          </Pressable>
          <Pressable style={styles.block}>
            <Text style={styles.blockTitle}>내 정보</Text>
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
  block: {
    // backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: 'skyblue',
    borderWidth: 5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  blockTitle: {
    fontFamily: Fonts.TRBold,
    fontSize: 18,
    color: 'dodgerblue',
  },
});

export default Main;
