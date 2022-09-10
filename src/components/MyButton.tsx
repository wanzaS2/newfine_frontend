import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Fonts} from '../assets/Fonts';
import {height, width} from '../config/globalStyles';

function MyButton({...props}) {
  return (
    <View style={styles.buttonZone}>
      <Pressable
        style={
          props.canGoNext
            ? StyleSheet.compose(styles.myButton, styles.myButtonActive)
            : styles.myButton
        }
        disabled={props.disabled}
        onPress={props.onPress}>
        {props.loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.myButtonText}>{props.text}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonZone: {
    alignItems: 'center',
    // backgroundColor: 'pink',
    paddingVertical: height * 10,
  },
  myButton: {
    backgroundColor: 'gray',
    paddingHorizontal: width * 20,
    paddingVertical: height * 10,
    borderRadius: 5,
  },
  myButtonActive: {
    backgroundColor: 'darkblue',
  },
  myButtonText: {
    fontFamily: Fonts.TRBold,
    color: 'white',
    fontSize: width * 17,
  },
});

export default MyButton;
