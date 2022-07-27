import React from 'react';
import {StyleSheet, Text} from 'react-native';

const Title = ({title}) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: 'black',
    margin: 30,
  },
});

export default Title;
