import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import {Fonts} from '../../assets/Fonts';
import SetUpProfile from '../../components/SetUpProfile';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {LoggedInParamList} from '../../../AppInner';

// type WelcomeScreenProps = NativeStackScreenProps<LoggedInParamList, 'Welcome'>;

function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <DismissKeyboardView>
        <View style={styles.textArea}>
          <Text style={styles.title}>환영합니다!</Text>
          <Text style={styles.description}>프로필을 설정하세요.</Text>
          <SetUpProfile />
        </View>
      </DismissKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  textArea: {
    marginTop: 30,
    flex: 1,
    // backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.TRBold,
    fontSize: 45,
    color: 'black',
  },
  description: {
    fontFamily: Fonts.TRBold,
    fontSize: 21,
  },
});

export default Welcome;
