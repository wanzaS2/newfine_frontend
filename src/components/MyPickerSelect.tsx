import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Fonts} from '../assets/Fonts';
import RNPickerSelect from 'react-native-picker-select';

function MyPickerSelect() {
  const [branch, setBranch] = useState('');
  const data = [
    {label: '대치', value: '대치'},
    {label: '반포', value: '반포'},
    {label: '압구정', value: '압구정'},
  ];

  const onChangeBranch = value => {
    console.log(value);
    setBranch(value);
  };

  return (
    <View style={{alignItems: 'center'}}>
      <RNPickerSelect
        textInputProps={{underlineColorAndroid: 'transparent'}}
        fixAndroidTouchableBug={true} // 안드로이드 에러 방지
        useNativeAndroidPickerStyle={false} // 기본 안드로이드 textInput 스타일 X, pickerSelect 스타일 O
        placeholder={{label: '분원을 선택해주세요.'}}
        value={branch}
        onValueChange={value => onChangeBranch(value)}
        // items={[
        //   {label: '반포', value: '반포'},
        //   {label: '반포', value: '반포'},
        //   {label: '반포', value: '반포'},
        // ]}
        items={data}
        style={pickerSelectStyles}
      />
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    height: 50,
    width: 300,
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  inputAndroid: {
    fontSize: 16,
    height: 50,
    width: 300,
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
});

export default MyPickerSelect;
