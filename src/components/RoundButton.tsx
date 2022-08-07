import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fonts} from '../assets/Fonts';

function RoundButton({...props}) {
  return (
    <Pressable
      style={
        props.canGoNext
          ? StyleSheet.compose(styles.button, styles.myButtonActive)
          : styles.button
      }
      disabled={props.disabled}
      onPress={props.onPress}>
      {props.loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{props.text}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonZone: {
    alignItems: 'center',
  },
  myButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  myButtonActive: {
    backgroundColor: 'darkblue',
  },
  myButtonText: {
    fontFamily: Fonts.TRRegular,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginBottom: 30,
    borderRadius: 35,

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        elevation: 0,
        marginHorizontal: 130,
      },
    }),
  },

  text: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
});

export default RoundButton;
