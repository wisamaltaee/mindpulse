import { Text, View, StyleSheet, Pressable } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function QuizIntro({ navigation }) {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  const { selectedTheme, themeGradients } = useTheme();

  if (!fontsLoaded) return null;

  const currentGradient = themeGradients[selectedTheme];

  return (
    <LinearGradient colors={currentGradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="clipboard" size={80} color="#a375d1" />
        </View>
        
        <Text style={styles.title}>Personality Assessment</Text>
        
        <Text style={styles.description}>
          Discover your unique mental wellness profile through this 8-question assessment. 
          Your answers will help us personalize your experience.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Feather name="clock" size={20} color="#70c299" />
            <Text style={styles.featureText}>Takes 5-7 minutes</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="lock" size={20} color="#59c0c0" />
            <Text style={styles.featureText}>Your data is private</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="zap" size={20} color="#FF6B6B" />
            <Text style={styles.featureText}>Get personalized insights</Text>
          </View>
        </View>

        <Pressable 
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz1')}
        >
          <Text style={styles.startButtonText}>Begin Assessment</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </Pressable>
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
    padding: 32,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Lato_700Bold',
    fontSize: 32,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    gap: 15,
    marginBottom: 50,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a375d1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  startButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
});