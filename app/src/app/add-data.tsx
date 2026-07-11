import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AddDataScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#14532D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Company Information</Text>
          <Text style={styles.cardDesc}>Fill out your company details to get listed on Tiruppur AI.</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Sri Balaji Dyeing" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} placeholder="e.g. Knitting, Dyeing, Printing" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} placeholder="Full address in Tiruppur" multiline numberOfLines={3} placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput style={styles.input} placeholder="+91 xxxxx xxxxx" keyboardType="phone-pad" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Brief description of your services" multiline numberOfLines={4} placeholderTextColor="#94A3B8" />
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, paddingTop: Platform.OS === 'web' ? 20 : 50, borderBottomWidth: 1, borderBottomColor: '#BBF7D0', backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#14532D' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#BBF7D0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#14532D', marginBottom: 5 },
  cardDesc: { fontSize: 14, color: '#166534', marginBottom: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#14532D', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 12, padding: 15, fontSize: 16, backgroundColor: '#F8FAFC', color: '#1E293B', ...Platform.select({ web: { outlineStyle: 'none' } }) as any },
  submitBtn: { backgroundColor: '#16A34A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
