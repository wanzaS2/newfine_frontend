import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Fonts} from '../assets/Fonts';

function MyTextInput({...props}, ref) {
  return (
    <TextInput
      style={styles.textInput}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor}
      maxLength={props.maxLength}
      textContentType={props.textContentType}
      keyboardType={props.keyboardType}
      value={props.value}
      returnKeyType={props.returnKeyType}
      clearButtonMode={props.clearButtonMode}
      ref={ref}
      onSubmitEditing={props.onSubmitEditing}
      blurOnSubmit={props.blurOnSubmit}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  textInput: {
    backgroundColor: 'lightgrey',
    fontFamily: Fonts.TRRegular,
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

const forwardedRefInput = React.forwardRef(MyTextInput);
export default forwardedRefInput;
