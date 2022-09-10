import React from 'react';
import {FlatList, StyleSheet, View, Text, Platform} from 'react-native';
import {Services} from '../slices/interfaces';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../assets/Fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {useNavigation} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {width, height} from '../config/globalStyles';

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
            <RNBounceable
              onPress={() => {
                navigation.navigate(item.next);
              }}
              style={styles.button}>
              <View style={styles.buttonDetail}>
                <FontAwesome5Icon
                  name={item.icon}
                  size={width * 45}
                  color={'darkblue'}
                />
              </View>
            </RNBounceable>
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
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: width * 10,
    marginBottom: height * 10,
    width: width * 110,
    height: height * 110,
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 16,
    // marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: width * 10,
          height: height * 10,
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
    marginBottom: height * 20,
    textAlign: 'center',
    fontSize: width * 17,
    fontFamily: Fonts.TRBold,
    color: 'darkblue',
    textTransform: 'capitalize',
  },
});

export default ServiceList;
