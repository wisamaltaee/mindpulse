import { Text, View, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import CustomSection from '../components/sections';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext'; // Import useTheme hook

export default function Meditation() {
  const [soundSelected, setSoundSelected] = useState('');
  const [timeSelection, setTimeSelection] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [sessionState, setSessionState] = useState('Start');
  const [narratorEnabled, setNarratorEnabled] = useState(false);
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  // Use the theme from ThemeProvider
  const { selectedTheme, themeGradients, themeOptions } = useTheme();

  useEffect(() => {
    let interval = null;
    if (isRunning && timeSelection > 0) {
      interval = setInterval(() => {
        setTimeSelection((prev) => prev - 1);
      }, 1000);
    } else if (timeSelection === 0 && isRunning) {
      player.stop();
      setIsRunning(false);
      setSessionState('Start');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeSelection]);

  const formatTime = () => {
    const minutes = Math.floor(timeSelection / 60);
    const seconds = timeSelection % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  async function sendData(time, soundSel) {
    try {
      const response = await axios.post("http://192.168.0.106:8000/send_session_data", {
        timeSession: time,
        sound: soundSel,
      });
      console.log(response.data);
    } catch (error) {
      console.log(response.data);
      console.error("Error sending data:", error);
    }
  }

  const sounds = {
    birds_music: require('../../assets/sounds/birds_music.mp3'),
    rain: require('../../assets/sounds/rain.mp3'),
    sunset: require('../../assets/sounds/sunset.mp3'),
  };

  const narratorSound = require('../../assets/sounds/breathing_exercises.mp3')

  const player = useAudioPlayer(sounds[soundSelected]);
  const narrator = useAudioPlayer(narratorSound);
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
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24}}>Meditation</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24}}>Take a moment to relax and center yourself</Text>
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20}}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Ionicons name='sparkles-outline' size={24} color={currentThemeColor} style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Choose Duration
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Select how long you'd like to meditate</Text>
            </View>
            <View style={{ marginTop: 4, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
              <Pressable
                style={[styles.startButton, { backgroundColor: 'white', borderWidth: 0.25, borderColor: 'grey', paddingVertical: 10 }, timeSelection === 300 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(5 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 300 && { color: currentThemeColor }]}>5m</Text>
              </Pressable>
              <Pressable
                style={[styles.startButton, { backgroundColor: 'white', borderWidth: 0.25, borderColor: 'grey', paddingVertical: 10 }, timeSelection === 600 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(10 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 600 && { color: currentThemeColor }]}>10m</Text>
              </Pressable>
              <Pressable
                style={[styles.startButton, { backgroundColor: 'white', borderWidth: 0.25, borderColor: 'grey', paddingVertical: 10 }, timeSelection === 900 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(15 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 900 && { color: currentThemeColor }]}>15m</Text>
              </Pressable>
              <Pressable
                style={[styles.startButton, { backgroundColor: 'white', borderWidth: 0.25, borderColor: 'grey', paddingVertical: 10 }, timeSelection === 1200 && { borderWidth: 1, borderColor: currentThemeColor }]}
                onPress={() => { setTimeSelection(20 * 60); }}
              >
                <Text style={[{ fontFamily: 'Lato_700Bold', color: 'grey', fontSize: 14 }, timeSelection === 1200 && { color: currentThemeColor }]}>20m</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='volume-2' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Voice Guidance
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Gentle voice prompts like "Breathe in... Breathe out"</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10}}>
              <Pressable
                onPress={() => setNarratorEnabled(!narratorEnabled)}
                style={{
                  paddingHorizontal: 40,
                  height: 30,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: narratorEnabled ? currentThemeColor : 'grey',
                  backgroundColor: narratorEnabled ? currentThemeColor : 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: narratorEnabled ? 'white': 'grey', fontWeight: 'bold', fontFamily: 'Lato_400Regular' }}>Narrator {narratorEnabled ? 'Enabled' : 'Disabled'}</Text>
              </Pressable>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='music' size={24} color={currentThemeColor} style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 Ambience Sounds
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20, marginBottom: 10}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Calming background music to enhance relaxation</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              <Pressable onPress={() => {setSoundSelected('birds_music'); }} style={[{width: 60, height: 100, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderColor: '#bbbbbbff'}, soundSelected === 'birds_music' &&  { borderColor: currentThemeColor }]}><Image style={{width: 50, height: 90, borderRadius: 4}} source={require("../../assets/images/bird-rainforest.jpg")} /></Pressable>
              <Pressable onPress={() => {setSoundSelected('rain'); }} style={[{width: 60, height: 100, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderColor: '#bbbbbbff'}, soundSelected === 'rain' &&  { borderColor: currentThemeColor }]}><Image style={{width: 50, height: 90, borderRadius: 4}} source={require("../../assets/images/rain-leaves.jpg")} /></Pressable>
              <Pressable onPress={() => {setSoundSelected('sunset'); }} style={[{width: 60, height: 100, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderColor: '#bbbbbbff'}, soundSelected === 'sunset' &&  { borderColor: currentThemeColor }]}><Image style={{width: 50, height: 90, borderRadius: 4}} source={require("../../assets/images/sunset.jpg")} /></Pressable>
              <Pressable onPress={() => {setSoundSelected('noSound'); }} style={[{width: 60, height: 100, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderColor: '#bbbbbbff'}, soundSelected === 'noSound' &&  { borderColor: currentThemeColor }]}><Image style={{width: 30, height: 30, borderRadius: 4}} source={require("../../assets/images/no-sound.png")} /></Pressable>
            </View>
          </View>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            {timeSelection > 0 && (
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 28, textAlign: 'center', marginVertical: 10 }}>
                {formatTime()}
              </Text>
            )}
            <View style={{ marginTop: 14 }}>
              <Pressable
                onPress={() => {
                  if (!soundSelected || !timeSelection) {
                    alert("Please select a duration and sound first!");
                    return;
                  }

                  if (!isRunning) {
                    sendData(timeSelection, soundSelected);
                    player.play();
                    if (narratorEnabled === true) {
                      narrator.play();
                    }
                    setIsRunning(true);
                    setSessionState('Stop');
                  } else {
                    player.pause();
                    player.seekTo(0);
                    narrator.pause();
                    narrator.seekTo(0);
                    setIsRunning(false);
                    setSessionState('Start');
                    setTimeSelection(0);
                  }
                }}
                style={[styles.startButton, { backgroundColor: currentThemeColor }]}
              >
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'white', fontSize: 16 }}>
                  {sessionState} Session
                </Text>
              </Pressable>
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
})