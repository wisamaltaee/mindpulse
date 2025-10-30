import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';

export default function CustomSection({type, iconType, iconColor, value, value2, value3}) {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  if (!fontsLoaded) return null;

  const types = {
    single: { borderRadius: 14, height: 100, backgroundColor: '#fefefe', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  }

  const valueTypes = {
    single: { fontFamily: 'Lato_900Black', fontSize: 28 },
  }

  const value2Types = {
    single: { fontFamily: 'Lato_400Regular', fontSize: 14, color: 'grey'},
  }


  return (
    <View style={[types[type], { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 2 }]}>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Feather name={iconType} size={30} color={iconColor} />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={valueTypes[type]}>{value}</Text>
        <Text style={value2Types[type]}>{value2}</Text>
      </View>
    </View>
  );

}