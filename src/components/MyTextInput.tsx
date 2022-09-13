import React from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import {Fonts} from '../assets/Fonts';
import {height, width} from '../config/globalStyles';

function MyTextInput({...props}, ref) {
  return (
    <View style={styles.container}>
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
        editable={props.editable}
        selectTextOnFocus={props.selectTextOnFocus}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: '100%', paddingVertical: height * 10},
  textInput: {
    backgroundColor: 'lightgrey',
    fontFamily: Fonts.TRRegular,
    fontSize: width * 14,
    paddingHorizontal: width * 15,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        paddingVertical: height * 10,
        },
    }),
  },
});

const forwardedRefInput = React.forwardRef(MyTextInput);
export default forwardedRefInput;
