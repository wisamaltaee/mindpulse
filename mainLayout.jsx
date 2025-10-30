import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Home from '../screens/home';
import Focus from '../screens/focus';
import Meditation from '../screens/meditation';
import Sleep from '../screens/sleep';
import Screen from '../screens/screen';
import Settings from '../screens/settings';
import Welcome from '../screens/welcome';
import QuizIntro from '../screens/quizintro';
import Quiz1 from '../screens/quiz1';
import Quiz2 from '../screens/quiz2';
import Quiz3 from '../screens/quiz3';
import Quiz4 from '../screens/quiz4';
import Quiz5 from '../screens/quiz5';
import Quiz6 from '../screens/quiz6';
import QuizResults from '../screens/quizresults';
import { Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemeProvider } from '../themes/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTab() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={size} color={color} />
        ) }} />
      <Tab.Screen name="Focus" component={Focus} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <Feather name="eye" size={size} color={color} />
        ) }} />
      <Tab.Screen name="Meditation" component={Meditation} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="meditation" size={size} color={color} />
        ) }} />
      <Tab.Screen name="Sleep" component={Sleep} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="bed" size={size} color={color} />
        ) }} />
      <Tab.Screen name="Screen" component={Screen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <Feather name="smartphone" size={size} color={color} />
        ) }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (
          <Feather name="settings" size={size} color={color} />
        ) }} />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="QuizIntro" component={QuizIntro} />
          <Stack.Screen name="Quiz1" component={Quiz1} />
          <Stack.Screen name="Quiz2" component={Quiz2} />
          <Stack.Screen name="Quiz3" component={Quiz3} />
          <Stack.Screen name="Quiz4" component={Quiz4} />
          <Stack.Screen name="Quiz5" component={Quiz5} />
          <Stack.Screen name="Quiz6" component={Quiz6} />
          <Stack.Screen name="QuizResults" component={QuizResults} />
          <Stack.Screen name="AppTab" component={AppTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
    
  );
}
