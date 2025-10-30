import { Text, View, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext'; // Import useTheme hook

export default function Sleep() {
  const [sleepHours, setSleepHours] = useState();
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  // Use the theme from ThemeProvider
  const { selectedTheme, themeGradients, themeOptions } = useTheme();

  if (!fontsLoaded) return null;

  const currentGradient = themeGradients[selectedTheme];
  const currentThemeColor = themeOptions.find(t => t.name === selectedTheme)?.color;

  return (
    <LinearGradient
      colors={currentGradient}
      style={styles.scroll}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      locations={[0.1, 0.9]}
    >
      <ScrollView contentContainerStyle={{paddingVertical: 40}}>
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24}}>Sleep Tracker</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24}}>Track and improve your sleep patterns</Text>
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20}}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='moon' size={24} color={currentThemeColor} style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Set Sleep Goal
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>When do you want to go to sleep tonight?</Text>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='clock' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Log Sleep
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>How many hours did you sleep?</Text>
            </View>
            <Text style={{ fontFamily: 'Lato_700Bold', color: 'black', fontSize: 16, marginTop: 8}}>Hours Slept</Text>
            <View style={{ marginTop: 4 }}>
              <TextInput
                placeholder='e.g., 7.5'
                placeholderTextColor="grey"
                style={[styles.textInput, { borderColor: currentThemeColor }]}
                value={sleepHours}
                onChangeText={setSleepHours}
                maxLength={4}
                keyboardType="numeric"
              />
            </View>
            <View style={{ marginTop: 4 }}>
              <Pressable 
                style={[styles.startButton, { backgroundColor: currentThemeColor }]} 
                disabled={!sleepHours}
              >
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'white', fontSize: 16}}>Log Sleep Duration</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='trending-up' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 This Week's Sleep
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Your sleep patterns over the past 7 days</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 16}}>
              <Text style={{flex: 2, fontFamily: 'Lato_400Regular', color: 'grey'}}>Average Sleep</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_400Regular', color: 'grey'}}>Sleep Goal</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{flex: 2, fontFamily: 'Lato_900Black', color: 'black', fontSize: 28}}>7.2 hrs</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: 'black', fontSize: 28}}>8 hrs</Text>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <FontAwesome5 name='lightbulb' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 Personalized Sleep Tips
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Based on your sleep patterns this week</Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>No current personalized suggestions...</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  bigBox: {
    borderRadius: 14,
    paddingBottom: 20,
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 3
  },
  startButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#a375d1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 3,
    flexDirection: 'row'
  },
  textInput: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Lato_400Regular',
    textAlign: 'center'
  },
  timeButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#a375d1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    flexDirection: 'row'
  },
  picker: {
    marginTop: 10,
  }
})