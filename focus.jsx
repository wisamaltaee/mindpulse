import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function Focus() {
  const [sessionStatus, setSessionStatus] = useState('No Current Session Created');
  const [breakSelection, setBreakSelection] = useState(25*60);
  const [timeSelection, setTimeSelection] = useState(5*60);
  const [sessionState, setSessionState] = useState(false);

  const { selectedTheme, themeGradients, themeOptions } = useTheme();

  useEffect(() => {
    if (!sessionState) return;

    const interval = setInterval(() => {
      setTimeSelection(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSessionState(false);
          setSessionStatus('Session Completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = () => {
    const minutes = Math.floor(timeSelection / 60);
    const seconds = timeSelection % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

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
      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24 }}>Focus Sessions</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24 }}>Manage your deep work and concentration time</Text>
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20 }}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Feather name='play' size={24} color='#70c299' style={{ paddingTop: 3 }} />
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24 }}> Begin Focus </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20 }}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey' }}>
                Start a new focused work session to boost your productivity</Text>
            </View>
            <View style={{ marginTop: 14 }}>
              <Pressable
                style={[styles.startButton, sessionStatus === 'Started' && {  
                  borderWidth: 0.25, 
                  borderColor: 'grey' }, {backgroundColor: sessionState ? 'white' : currentThemeColor}]}
                onPress={() => {
                  if (timeSelection > 0 && breakSelection > 0) {
                    setSessionStatus('Started');
                    setSessionState(true);
                  }
                  console.log(sessionStatus);
                }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', 
                  fontSize: 16, color: sessionState ? 'grey' : 'white'}]}>
                  {sessionState ? 'Session Begun' : 'Start Session'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Feather name='pause' size={24} color='#59c0c0' style={{ paddingTop: 3 }} />
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24 }}> Resume Focus </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20 }}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey' }}>Continue your previous session after taking a break</Text>
            </View>
            <View style={{ marginTop: 14 }}>
              <Pressable 
                style={[styles.startButton, { backgroundColor: sessionState ? currentThemeColor : 'white', borderWidth: 0.25, borderColor: 'grey' }]} 
                onPress={() => {setSessionState(false)}}
              >
                <Text style={{ fontFamily: 'Lato_700Bold', color: sessionState ? 'white' : 'grey', fontSize: 14 }}>
                  {sessionState ? 'Pause Session' : 'No Active Session'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Feather name='target' size={24} color='#9966cc' style={{ paddingTop: 3 }} />
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24 }}> Set Goal </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20 }}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey' }}>Choose your target duration and break duration for the focus session</Text>
            </View>

            <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey', marginTop: 14, textAlign: 'center' }}> Focus Time </Text>
            <View style={{ marginTop: 4, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
              <Pressable
                style={[styles.timeButton, timeSelection === 15*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(15 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 15*60 && { color: currentThemeColor }]}>15m</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, timeSelection === 25*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(25 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 25*60 && { color: currentThemeColor }]}>25m</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, timeSelection === 35*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(35 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 35*60 && { color: currentThemeColor }]}>35m</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, timeSelection === 45*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(45 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 45*60 && { color: currentThemeColor }]}>45m</Text>
              </Pressable>
            </View>

            <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey', marginTop: 14, textAlign: 'center' }}> Break Time </Text>
            <View style={{ marginTop: 4, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
              <Pressable
                style={[styles.timeButton, breakSelection === 5*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setBreakSelection(5 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, breakSelection === 5*60 && { color: currentThemeColor }]}>5m</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, breakSelection === 10*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setBreakSelection(10 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, breakSelection === 10*60 && { color: currentThemeColor }]}>10m</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, breakSelection === 15*60 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setBreakSelection(15 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, breakSelection === 15*60 && { color: currentThemeColor }]}>15m</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='menu' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}> Current Session </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Your active focus session will appear here</Text>
            </View>
            {timeSelection > 0 && (
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 28, textAlign: 'center', marginVertical: 10 }}>
                {formatTime()}
              </Text>
            )}
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
  timeButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 0.25,
    borderColor: 'grey',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});