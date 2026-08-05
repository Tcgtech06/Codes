import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>Last updated: August 2026</Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Tiruppur AI, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
        </Text>

        <Text style={styles.heading}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Tiruppur AI is an intelligent assistant provided by TCG Technologies designed to help users connect with the textile industry in Tiruppur, search for companies, and obtain business-related information. 
        </Text>

        <Text style={styles.heading}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </Text>

        <Text style={styles.heading}>4. Acceptable Use</Text>
        <Text style={styles.paragraph}>
          You agree not to use the application for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You shall not attempt to reverse engineer, decompile, or extract the source code of the app or its AI models.
        </Text>

        <Text style={styles.heading}>5. Data and Content</Text>
        <Text style={styles.paragraph}>
          The information provided by Tiruppur AI is based on available databases and AI generation. While we strive for accuracy, TCG Technologies does not guarantee the completeness or accuracy of any information. We are not liable for any business decisions made based on the provided data.
        </Text>

        <Text style={styles.heading}>6. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content, design, logos, and infrastructure of Tiruppur AI are the exclusive property of TCG Technologies. You may not copy, modify, distribute, or use them without prior written permission.
        </Text>

        <Text style={styles.heading}>7. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          TCG Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. The service is provided on an "as is" and "as available" basis.
        </Text>

        <Text style={styles.heading}>8. Modifications to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or replace these Terms at any time. Significant changes will be communicated through the application. Continued use of the app after any such changes constitutes your acceptance of the new Terms.
        </Text>

        <Text style={styles.heading}>9. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns regarding these Terms, please contact us:
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
