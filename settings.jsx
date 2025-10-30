import { Text, View, ScrollView, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native";
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import CustomSection from '../components/sections';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';

export default function Settings() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  const { selectedTheme, changeTheme, themeGradients, themeOptions } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

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
        <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 40, paddingHorizontal: 24}}>Settings</Text>
        <Text style={{ fontFamily: 'Lato_400Regular', fontSize: 16, paddingHorizontal: 24}}>Manage your account and preferences</Text>
        <View style={{ paddingHorizontal: 24, gap: 14, marginTop: 20}}>
          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='pen-tool' size={24} color={currentThemeColor} style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Change Theme
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Change the theme and colors of the app to match your preferences</Text>
            </View>
            <View style={{ marginTop: 14 }}>
              <Pressable 
                style={[styles.startButton, {backgroundColor: 'white', justifyContent: 'space-between', borderColor: currentThemeColor, borderWidth: 2}]}
                onPress={() => setShowThemeDropdown(true)}
              >
                <Text style={{ fontFamily: 'Lato_700Bold', color: currentThemeColor, fontSize: 16 }}>
                  {selectedTheme}
                </Text>
                <Feather name="chevron-down" size={20} color={currentThemeColor} />
              </Pressable>

              <Modal
                visible={showThemeDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowThemeDropdown(false)}
              >
                <TouchableOpacity 
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setShowThemeDropdown(false)}
                >
                  <View style={styles.dropdownContainer}>
                    {themeOptions.map((theme, index) => (
                      <Pressable
                        key={theme.name}
                        style={[
                          styles.themeOption,
                          index !== themeOptions.length - 1 && styles.themeOptionBorder
                        ]}
                        onPress={() => {
                          changeTheme(theme.name);
                          setShowThemeDropdown(false);
                        }}
                      >
                        <View style={[styles.colorDot, { backgroundColor: theme.color }]} />
                        <Text style={styles.themeText}>{theme.name}</Text>
                        {selectedTheme === theme.name && (
                          <Feather name="check" size={20} color={theme.color} />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='bell' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                Notifications
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Control when and how you receive reminders and updates</Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Pressable style={[styles.startButton, { backgroundColor: currentThemeColor }]}>
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'white', fontSize: 16}}>Enable Notifications</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='mail' size={24} color='#70c299' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 Account Management
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Need help with your account? Contact our support team</Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Pressable style={[styles.startButton, {backgroundColor: 'white'}]}>
                <Feather name='mail' size={20} color='black' style={{marginRight: 4}}/>
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'black', fontSize: 16}}>Contact Support</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='shield' size={24} color='#59c0c0' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24}}>
                 Privacy Policy
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Your data and how we protect it</Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>We are committed to protecting your privacy and ensuring your personal information is secure. Your wellness data is encrypted and stored securely. We never share your information with third parties without your explicit consent.</Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Pressable style={[styles.startButton, {backgroundColor: 'white'}]}>
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'black', fontSize: 16}}>View Full Privacy Policy</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bigBox, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <View style={{ flexDirection: 'row', gap: 5}}>
              <Feather name='trash' size={24} color='#e05252' style={{paddingTop: 3}}/>
              <Text style={{ fontFamily: 'Lato_700Bold', fontSize: 24, color: '#e05252'}}>
                 Delete Profile
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey'}}>Permanently remove your account and all associated data</Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Pressable style={[styles.startButton, {backgroundColor: '#e05252'}]}>
                <Text style={{ fontFamily: 'Lato_700Bold', color: 'white', fontSize: 16}}>Delete My Profile</Text>
              </Pressable>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 20}}>
              <Text style={{ fontFamily: 'Lato_400Regular', color: 'grey', textAlign: 'center'}}>Warning: This action cannot be undone</Text>
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
    gap: 10,
    flexDirection: 'row'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  themeOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  themeText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    flex: 1,
  },
});