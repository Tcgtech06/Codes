import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  
  const [resetting, setResetting] = useState(false);

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      Alert.alert('Error', 'No email address associated with your account.');
      return;
    }

    setResetting(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert('Success', `A password reset link has been sent to ${user.email}.`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email.');
    } finally {
      setResetting(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.cardBg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#334155' : '#F3F4F6' }]}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={isDark ? "#818CF8" : "#F59E0B"} />
            </View>
            <Text style={styles.menuText}>Dark Theme</Text>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.accent }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]} 
            onPress={handlePasswordReset}
            disabled={resetting}
          >
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#7F1D1D' : '#FEF2F2' }]}>
              <Ionicons name="key-outline" size={20} color={colors.danger} />
            </View>
            <Text style={styles.menuText}>Reset Password</Text>
            {resetting ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        
        {user?.email && (
           <Text style={styles.helperText}>Reset link will be sent to {user.email}</Text>
        )}

      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  content: { padding: 20, width: '100%', maxWidth: 600, alignSelf: 'center' },
  
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, marginLeft: 4, marginTop: 10, textTransform: 'uppercase' },
  menuGroup: { 
    backgroundColor: colors.cardBg, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary, marginLeft: 16 },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    marginTop: -8,
  }
});
