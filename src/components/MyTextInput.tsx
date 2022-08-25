import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Fonts} from '../assets/Fonts';

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
  container: {width: '100%', paddingVertical: 10},
  textInput: {
    backgroundColor: 'lightgrey',
    fontFamily: Fonts.TRRegular,
    fontSize: 14,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

const forwardedRefInput = React.forwardRef(MyTextInput);
export default forwardedRefInput;
