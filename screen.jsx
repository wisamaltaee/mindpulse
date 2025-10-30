import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import CustomSection from '../components/sections';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function Screen() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

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
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24}}>Screen Time Analytics</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24}}>Track your digital habits and productivity</Text>
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20}}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='phone' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Games & Social Media
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Entertainment screen time today</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: '#59c0c0', fontSize: 30}}>2h 15m</Text>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <FontAwesome5 name='suitcase' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Work & Productivity
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Productive screen time today</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: '#70c299', fontSize: 30}}>5h 45m</Text>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='trending-up' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 Efficiency Trends
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>How you're doing compared to previous periods</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 16}}>
              <Text style={{flex: 1, fontFamily: 'Lato_400Regular', color: 'grey'}}>This Week vs Last Week</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_400Regular', color: 'grey'}}>Work/Play Ratio</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_400Regular', color: 'grey'}}>Best Focus Day</Text>
            </View>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: '#74c49c', fontSize: 22}}>+15%</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: 'black', fontSize: 22}}>72/28</Text>
              <Text style={{flex: 1, fontFamily: 'Lato_900Black', color: 'black', fontSize: 22}}>Monday</Text>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <FontAwesome5 name='lightbulb' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                  Weekly Breakdown
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Your screen time distribution over the past 7 days</Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Chart visualization coming soon...</Text>
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
})