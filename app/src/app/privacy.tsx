import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>Last updated: August 2026</Text>

        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Tiruppur AI. TCG Technologies ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.
        </Text>

        <Text style={styles.heading}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: 'bold' }}>Personal Data:</Text> We may collect personal information such as your name, email address, phone number, and business details when you register, log in, or update your profile.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: 'bold' }}>Usage Data:</Text> We collect data on how you interact with our AI assistant, including chat history, voice search inputs (which are temporarily processed for text-to-speech), and search queries regarding the Tiruppur textile industry.
        </Text>

        <Text style={styles.heading}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
          {"\n"}• Provide, operate, and maintain Tiruppur AI.
          {"\n"}• Improve personalization and AI response accuracy.
          {"\n"}• Maintain your chat history and user preferences.
          {"\n"}• Communicate with you for customer service and updates.
        </Text>

        <Text style={styles.heading}>4. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          We use industry-standard security measures, including Google Firebase, to store and protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
        </Text>

        <Text style={styles.heading}>5. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not sell, trade, or rent your personal data to third parties. We may share information with trusted service providers (such as AI models via Genkit and Firebase) strictly for operating the application.
        </Text>

        <Text style={styles.heading}>6. Third-Party AI Services</Text>
        <Text style={styles.paragraph}>
          Tiruppur AI utilizes third-party AI models (like Google Gemini and Groq) to process your queries. By using the app, you acknowledge that your search queries may be processed by these external models in accordance with their respective privacy policies.
        </Text>

        <Text style={styles.heading}>7. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your personal information. You can delete your account and associated data directly from the Profile page.
        </Text>

        <Text style={styles.heading}>8. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact TCG Technologies at:
          {"\n"}Email: support@tcgtech.in
          {"\n"}Website: https://tcgtech.in
        </Text>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0', 
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  content: { padding: 24, backgroundColor: '#FFFFFF', margin: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  heading: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 8 }
});
