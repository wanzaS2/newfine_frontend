import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ranking} from '../slices/ranking';

function EachRanking({item}: {item: ranking}) {
  return (
    <View>
      <Text style={styles.item}>
        <Text>{item.nickname}</Text>
        <Text>{item.point} p</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'pink',
  },
});

export default EachRanking;
