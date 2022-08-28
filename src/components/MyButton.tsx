import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Fonts} from '../assets/Fonts';

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
    paddingVertical: 10,
  },
  myButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  myButtonActive: {
    backgroundColor: 'darkblue',
  },
  myButtonText: {
    fontFamily: Fonts.TRBold,
    color: 'white',
    fontSize: 17,
  },
});

export default MyButton;
