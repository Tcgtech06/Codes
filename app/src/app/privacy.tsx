import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>Last updated: July 2026</Text>
        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          Tirupur AI collects information you provide directly to us when you use our chat services, create an account, or contact support. This may include your name, email address, phone number, and any chat history or voice recordings you provide.
        </Text>
        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve our services, including to train our AI models (unless you opt-out) and provide personalized search results regarding Tirupur textile businesses.
        </Text>
        <Text style={styles.heading}>3. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal data. We may share information with trusted third-party service providers to help operate our business, or when required by law.
        </Text>
        <Text style={styles.heading}>4. Security</Text>
        <Text style={styles.paragraph}>
          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
        </Text>
        <Text style={styles.heading}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at support@tirupurai.com.
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
