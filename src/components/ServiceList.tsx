import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import {Services} from '../slices/interfaces';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {useNavigation} from '@react-navigation/native';

interface Props {
  list: Array<Services>;
}

type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'StudentMain'>;

function ServiceList({list}: Props, {navigation}: MainScreenProps) {
  navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          // backgroundColor: 'pink',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={list}
        renderItem={({item, index}) => (
          <View>
            <Pressable
              onPress={() => {
                navigation.navigate(item.next);
              }}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#f0f9ff' : 'white',
                  width: pressed ? 107 : 110, //  나중에 애니메이션으로
                  height: pressed ? 107 : 110,
                },
                styles.button,
              ]}>
              <View style={styles.buttonDetail}>
                <FontAwesome5Icon
                  name={item.icon}
                  size={45}
                  color={'darkblue'}
                />
              </View>
            </Pressable>
            <View>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </View>
        )}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    // backgroundColor: 'green',
  },
  button: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    // width: 110,
    // height: 110,
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 16,
    // marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonDetail: {
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: Fonts.TRBold,
    color: 'darkblue',
    textTransform: 'capitalize',
  },
});

export default ServiceList;
