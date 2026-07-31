import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>Last updated: July 2026</Text>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using Tirupur AI, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
        </Text>
        <Text style={styles.heading}>2. Use of Service</Text>
        <Text style={styles.paragraph}>
          Tirupur AI is designed to assist with textile and garment business queries in Tirupur. You agree not to use the service for any illegal or unauthorized purpose, including scraping data or abusing our AI infrastructure.
        </Text>
        <Text style={styles.heading}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
        </Text>
        <Text style={styles.heading}>4. Accuracy of Information</Text>
        <Text style={styles.paragraph}>
          While we strive to provide accurate information from our Tirupur DB, we do not warrant that any information, business contacts, or results provided by the AI are completely accurate, current, or error-free.
        </Text>
        <Text style={styles.heading}>5. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. We will notify users of any significant changes via the app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  content: { padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 20, marginBottom: 10 },
  paragraph: { fontSize: 15, color: '#475569', lineHeight: 24 }
});
