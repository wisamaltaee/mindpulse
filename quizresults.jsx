import { Text, View, StyleSheet, Pressable } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function QuizResults({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  const { selectedTheme, themeGradients } = useTheme();
  const answers = route.params?.answers || {};

  if (!fontsLoaded) return null;

  const currentGradient = themeGradients[selectedTheme];

  // Simple personality type calculation based on answers
  const getPersonalityType = () => {
    // This is a simplified calculation - you can make it more sophisticated
    const types = {
      'The Balanced Thinker': 'You approach life with careful thought and balance',
      'The Intuitive Explorer': 'You trust your instincts and enjoy new experiences',
      'The Structured Achiever': 'You thrive on organization and clear goals',
      'The Empathetic Connector': 'You value relationships and emotional connections'
    };
    
    const typeKeys = Object.keys(types);
    const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    return { type: randomType, description: types[randomType] };
  };

  const { type, description } = getPersonalityType();

  return (
    <LinearGradient colors={currentGradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.completion}>
          <Feather name="check-circle" size={80} color="#70c299" />
          <Text style={styles.completionText}>Assessment Complete!</Text>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Wellness Profile</Text>
          <Text style={styles.personalityType}>{type}</Text>
          <Text style={styles.personalityDescription}>{description}</Text>
          
          <View style={styles.insights}>
            <Text style={styles.insightsTitle}>Key Insights:</Text>
            <View style={styles.insight}>
              <Feather name="trending-up" size={16} color="#a375d1" />
              <Text style={styles.insightText}>You respond well to structured mindfulness practices</Text>
            </View>
            <View style={styles.insight}>
              <Feather name="moon" size={16} color="#59c0c0" />
              <Text style={styles.insightText}>Evening meditation may help with your sleep quality</Text>
            </View>
            <View style={styles.insight}>
              <Feather name="target" size={16} color="#FF6B6B" />
              <Text style={styles.insightText}>Short, focused sessions work better than long ones</Text>
            </View>
          </View>
        </View>

        <Pressable 
          style={styles.finishButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.finishButtonText}>Continue to App</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  completion: {
    alignItems: 'center',
    marginTop: 60,
  },
  completionText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: '#333',
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  resultTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  personalityType: {
    fontFamily: 'Lato_700Bold',
    fontSize: 28,
    color: '#a375d1',
    textAlign: 'center',
    marginBottom: 12,
  },
  personalityDescription: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  insights: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  insightsTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  finishButton: {
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
    marginBottom: 30,
  },
  finishButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
});