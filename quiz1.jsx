import { Text, View, StyleSheet, Pressable } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function Quiz1({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  const { selectedTheme, themeGradients } = useTheme();

  if (!fontsLoaded) return null;

  const currentGradient = themeGradients[selectedTheme];

  const handleAnswer = (answer) => {
    navigation.navigate('Quiz2', {
      answers: { ...route.params?.answers, q1: answer }
    });
  };

  return (
    <LinearGradient colors={currentGradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progress}>
          <Text style={styles.progressText}>Question 1 of 8</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '12.5%' }]} />
          </View>
        </View>

        <Text style={styles.question}>
          Where do you typically get your energy from?
        </Text>

        <View style={styles.options}>
          <Pressable 
            style={styles.option}
            onPress={() => handleAnswer('social')}
          >
            <Text style={styles.optionEmoji}>👥</Text>
            <Text style={styles.optionText}>Social interactions and being around people</Text>
          </Pressable>

          <Pressable 
            style={styles.option}
            onPress={() => handleAnswer('solitude')}
          >
            <Text style={styles.optionEmoji}>🌿</Text>
            <Text style={styles.optionText}>Quiet time alone to recharge</Text>
          </Pressable>

          <Pressable 
            style={styles.option}
            onPress={() => handleAnswer('balanced')}
          >
            <Text style={styles.optionEmoji}>⚖️</Text>
            <Text style={styles.optionText}>A balanced mix of both</Text>
          </Pressable>

          <Pressable 
            style={styles.option}
            onPress={() => handleAnswer('depends')}
          >
            <Text style={styles.optionEmoji}>🔄</Text>
            <Text style={styles.optionText}>It depends on my mood and situation</Text>
          </Pressable>
        </View>
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
    paddingTop: 60,
  },
  progress: {
    marginBottom: 40,
  },
  progressText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a375d1',
    borderRadius: 3,
  },
  question: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    marginBottom: 40,
    lineHeight: 32,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
});