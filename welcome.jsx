import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function WelcomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  const [selectedTheme, setSelectedTheme] = useState('Default');

  const themeGradients = {
    'Default': ['#ffffff', '#a375d1'],
    'Sunset': ['#ffffff', '#FF6B6B'],
    'Ocean': ['#ffffff', '#4ECDC4'],
    'Forest': ['#ffffff', '#70c299'],
    'Lavender': ['#ffffff', '#9966cc']
  };

  if (!fontsLoaded) return null;

  const currentGradient = themeGradients[selectedTheme];

  return (
    <LinearGradient
      colors={currentGradient}
      style={styles.container}
      start={{ x: 0.25, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      locations={[0.1, 0.9]}
    >
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image style={{width: 100, height: 100, borderRadius: 100}} resizeMode="cover" source={require('../../assets/images/mindpulse_icon.png')}/>
          </View>
          <Text style={styles.appName}>MindPulse</Text>
          <Text style={styles.tagline}>Your Mental Wellness Companion</Text>
        </View>

        {/* Early Access Badge */}
        <View style={styles.badge}>
          <Feather name="zap" size={16} color="#FFD700" />
          <Text style={styles.badgeText}>Early Access • Developer Mode</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome to MindPulse</Text>
          <Text style={styles.welcomeDescription}>
            Track your mental wellness, build better habits, and find your focus with our AI-powered wellness platform.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable 
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('QuizIntro')}
          >
            <Feather name="user-plus" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </Pressable>

          <Pressable 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('AppTab')}
          >
            <Feather name="log-in" size={20} color="#a375d1" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </Pressable>
        </View>

        {/* Features List */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Feather name="trending-up" size={20} color="#70c299" />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="moon" size={20} color="#9966cc" />
            <Text style={styles.featureText}>Sleep analytics</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="target" size={20} color="#59c0c0" />
            <Text style={styles.featureText}>Focus sessions</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="activity" size={20} color="#FF6B6B" />
            <Text style={styles.featureText}>Mental wellness insights</Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  appName: {
    fontFamily: 'Lato_900Black',
    fontSize: 36,
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: '#666',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    alignSelf: 'center',
    marginBottom: 40,
  },
  badgeText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: '#B8860B',
    marginLeft: 6,
  },
  welcomeText: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#a375d1',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: '#a375d1',
  },
  buttonIcon: {
    marginRight: 12,
  },
  primaryButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: 'white',
  },
  secondaryButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: '#a375d1',
  },
  features: {
    gap: 12,
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});