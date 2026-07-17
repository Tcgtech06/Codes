import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { createUserWithEmailAndPassword, updateProfile, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, app, db } from '../config/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRef } from 'react';

const t = {
  bg: '#F0F9FF',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  accent1: '#10B981', // Emerald
  accent2: '#0EA5E9', // Sky Blue
  danger: '#EF4444',
};

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'EN' | 'TA' | 'TG' | 'HI'>('EN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Phone Auth States
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaVerifier = useRef(null);

  const handleSignup = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Save preferred language to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        preferredLanguage,
        createdAt: new Date().toISOString()
      });

      router.replace('/'); // Go to home on success
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!phoneNumber) return setError('Please enter your phone number');
    
    setLoading(true);
    setError('');
    
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+91' + phoneNumber;
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current as any);
      setConfirmResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!otp || !confirmResult) return setError('Please enter OTP');
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await confirmResult.confirm(otp);
      
      // Save preferred language to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        phone: phoneNumber,
        preferredLanguage,
        createdAt: new Date().toISOString()
      }, { merge: true });

      router.replace('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={32} color={t.accent1} />
          </View>
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Tiruppur AI platform</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {authMode === 'email' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={t.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={t.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={t.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={t.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={t.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor={t.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Language</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {['EN', 'TA', 'TG', 'HI'].map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      onPress={() => setPreferredLanguage(lang as any)}
                      style={[
                        styles.langPill,
                        preferredLanguage === lang && { backgroundColor: t.accent1, borderColor: t.accent1 }
                      ]}
                    >
                      <Text style={[styles.langPillText, preferredLanguage === lang && { color: '#fff' }]}>
                        {lang === 'EN' ? 'English' : lang === 'TA' ? 'Tamil' : lang === 'TG' ? 'Tanglish' : 'Hindi'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.signupButton} 
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!confirmResult ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="call-outline" size={20} color={t.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="+91 98765 43210"
                        placeholderTextColor={t.textSecondary}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                      />
                    </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Language</Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {['EN', 'TA', 'TG', 'HI'].map((lang) => (
                        <TouchableOpacity
                          key={lang}
                          onPress={() => setPreferredLanguage(lang as any)}
                          style={[
                            styles.langPill,
                            preferredLanguage === lang && { backgroundColor: t.accent1, borderColor: t.accent1 }
                          ]}
                        >
                          <Text style={[styles.langPillText, preferredLanguage === lang && { color: '#fff' }]}>
                            {lang === 'EN' ? 'English' : lang === 'TA' ? 'Tamil' : lang === 'TG' ? 'Tanglish' : 'Hindi'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.signupButton} 
                    onPress={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>Send OTP</Text>}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Enter OTP</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="keypad-outline" size={20} color={t.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="123456"
                        placeholderTextColor={t.textSecondary}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.signupButton} 
                    onPress={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>Verify & Sign Up</Text>}
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
            <Text style={{ marginHorizontal: 16, color: t.textSecondary, fontSize: 14 }}>Or sign up with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
          </View>

          <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
            <TouchableOpacity 
              style={[styles.socialButton, { flex: 1 }]}
              onPress={() => alert('Thala, Google Sign-Up requires Client ID setup in Firebase Console. We will add the logic once keys are ready!')}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { flex: 1, backgroundColor: authMode === 'phone' ? '#ECFDF5' : t.bg, borderColor: authMode === 'phone' ? t.accent1 : t.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAuthMode(authMode === 'phone' ? 'email' : 'phone');
                setError('');
                setConfirmResult(null);
              }}
            >
              <Ionicons name={authMode === 'phone' ? "mail" : "call"} size={20} color={t.accent1} />
              <Text style={styles.socialButtonText}>{authMode === 'phone' ? 'Email' : 'Phone'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: t.cardBg,
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: t.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: t.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: t.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: t.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: t.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 12,
    backgroundColor: t.bg,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: t.textPrimary,
    ...(Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)),
  },
  signupButton: {
    backgroundColor: t.accent1,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: t.accent1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
  },
  footerText: {
    color: t.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: t.accent1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.bg,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: t.textPrimary,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.bg,
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: t.textSecondary,
  }
});
