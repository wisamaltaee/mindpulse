import { Text, View, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import CustomSection from '../components/sections';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
});

export default function Home() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });
  const [selection, setSelection] = useState('');
  const [checkInEnabled, setCheckInEnabled] = useState(false);
  
  const { selectedTheme, themeGradients, themeOptions } = useTheme();

  useEffect(() => {
    configureNotifications();
    checkScheduledNotifications();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      handleNotificationResponse(response);
    });
    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const configureNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission required', 'Notifications are required for wellness check-ins.');
        return false;
      }
    }
    return true;
  };

  const scheduleWellnessCheckIns = async () => {
    const hasPermission = await configureNotifications();
    if (!hasPermission) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Wellness Check-in 🌟",
        body: "How are you feeling right now? Take a moment to check in with yourself!",
        data: { type: 'wellness-check' },
        sound: true,
        priority: 'high',
      },
      trigger: {
        seconds: 6 * 60 * 60,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Mental Wellness Reminder 💫",
        body: "Remember to take deep breaths and be kind to yourself today!",
        data: { type: 'motivation' },
        sound: true,
      },
      trigger: {
        seconds: 12 * 60 * 60,
        repeats: true,
      },
    });

    setCheckInEnabled(true);
    Alert.alert('Wellness Check-ins Enabled', 'You will receive wellness check-in notifications every 6 hours.');
  };

  const stopWellnessCheckIns = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setCheckInEnabled(false);
    Alert.alert('Check-ins Disabled', 'Wellness check-in notifications have been stopped.');
  };

  const handleNotificationResponse = (response) => {
    const { type } = response.notification.request.content.data;
    
    if (type === 'wellness-check') {
      Alert.alert(
        "Wellness Check-in",
        "How are you feeling right now?",
        [
          {
            text: "I'm doing great! 😊",
            onPress: () => console.log("User is doing well")
          },
          {
            text: "Could be better 😐",
            onPress: () => console.log("User is okay")
          },
          {
            text: "Not so good 😔",
            onPress: () => {
              console.log("User needs support");
              Alert.alert(
                "Take Care 🌿",
                "Remember to be gentle with yourself. Consider trying a breathing exercise or reaching out to someone you trust."
              );
            }
          }
        ]
      );
    }
  };

  const checkScheduledNotifications = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    setCheckInEnabled(scheduled.length > 0);
  };

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
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24}}>Welcome back!</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24}}>Here's your mental wellness overview</Text>
        
        <View style={{ paddingHorizontal: 24, gap: 14}}>
          <CustomSection type='single' iconType='target' iconColor='#70c299' value='5 days' value2='Current Streak' ></CustomSection>
          <CustomSection type='single' iconType='trending-up' iconColor='#9966cc' value='7.2/10' value2='Mood Average' ></CustomSection>
          <CustomSection type='single' iconType='feather' iconColor='#59c0c0' value='12' value2='Activities Done' ></CustomSection>
        </View>
        
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20}}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center'}}>
              <Feather name='bell' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Wellness Reminders
              </Text>
            </View>
            <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey', marginBottom: 10}}>
              Get gentle reminders to check in with your mental wellness
            </Text>
            <View style={{ marginTop: 10 }}>
              <Pressable
                style={[
                  styles.notificationButton, 
                  { backgroundColor: checkInEnabled ? '#70c299' : currentThemeColor }
                ]}
                onPress={checkInEnabled ? stopWellnessCheckIns : scheduleWellnessCheckIns}
              >
                <Feather 
                  name={checkInEnabled ? 'bell-off' : 'bell'} 
                  size={20} 
                  color='white' 
                />
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'white', fontSize: 16 }}>
                  {checkInEnabled ? 'Disable Reminders' : 'Enable 6-Hour Check-ins'}
                </Text>
              </Pressable>
            </View>
            {checkInEnabled && (
              <Text style={{ fontFamily: 'Lato_400Regular', color: '#70c299', textAlign: 'center', marginTop: 10 }}>
                ✓ Wellness reminders active - Next check-in in 6 hours
              </Text>
            )}
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='message-square' size={24} color='#9a66cc' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Daily Check-in
              </Text>
            </View>
            <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey', marginBottom: 10}}>
              How are you feeling right now?
            </Text>
            <View style={{ paddingHorizontal: 24, gap: 20, flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{gap: 10}}>
                <Pressable style={[styles.moodButton, selection === 'Relaxed' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Relaxed')}}><Text style={{fontSize: 20}}>😎</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Relaxed</Text></Pressable>
                <Pressable style={[styles.moodButton, selection === 'Good' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Good')}}><Text style={{fontSize: 20}}>😊</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Good</Text></Pressable>
                <Pressable style={[styles.moodButton, selection === 'Low' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Low')}}><Text style={{fontSize: 20}}>😔</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Low</Text></Pressable>
              </View>
              <View style={{gap: 10}}>
                <Pressable style={[styles.moodButton, selection === 'Great' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Great')}}><Text style={{fontSize: 20}}>😁</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Great</Text></Pressable>
                <Pressable style={[styles.moodButton, selection === 'Okay' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Okay')}}><Text style={{fontSize: 20}}>😐</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Okay</Text></Pressable>
                <Pressable style={[styles.moodButton, selection === 'Anxious' && { borderWidth: 1, borderColor: currentThemeColor }]} onPress={() => {setSelection('Anxious')}}><Text style={{fontSize: 20}}>😰</Text><Text style={{ fontFamily: 'Lato_700Bold', textAlign: 'center'}}>Anxious</Text></Pressable>
              </View>
            </View>
          </View>
          
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='cpu' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                AI Suggestions
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>No current AI suggestions...</Text>
            </View>
          </View>
          
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='bar-chart-2' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Your Progress
              </Text>
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
  moodButton: {
    borderRadius: 14,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    backgroundColor: '#fefefe',
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
  notificationButton: {
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
    gap: 10,
    flexDirection: 'row'
  },
})