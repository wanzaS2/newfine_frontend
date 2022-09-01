import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Fonts} from '../assets/Fonts';

const Title = ({title}) => {
  return <Text style={styles.title}>#{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: '#fef08a',
    fontSize: 40,
    fontWeight: '600',
    fontFamily: Fonts.TRBold,
    color: 'black',
    marginHorizontal: 20,
  },
});

export default Title;
