import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AdvertiseScreen() {
  const router = useRouter();
  
  const options = [
    { title: 'Advertise in Tiruppur AI', desc: 'Feature your banner across the main interface.', icon: 'megaphone-outline', color: '#3B82F6' },
    { title: 'Rank your Data in top', desc: 'Appear first when users search for your category.', icon: 'trending-up', color: '#16A34A' },
    { title: 'Get verified Tick', desc: 'Build trust with a premium verified badge.', icon: 'checkmark-circle-outline', color: '#9333EA' },
    { title: 'Collaborate with us', desc: 'Custom integrations and premium partnerships.', icon: 'people-outline', color: '#F59E0B' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#14532D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advertise With Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={styles.mainTitle}>Grow your business in Tiruppur</Text>
          <Text style={styles.subTitle}>Reach thousands of textile manufacturers, buyers, and suppliers directly on Tiruppur AI.</Text>
        </View>

        <View style={styles.grid}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: opt.color + '1A' }]}>
                <Ionicons name={opt.icon as any} size={32} color={opt.color} />
              </View>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.desc}</Text>
              <View style={styles.arrowBox}>
                 <Ionicons name="arrow-forward" size={20} color={opt.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, paddingTop: Platform.OS === 'web' ? 20 : 50, borderBottomWidth: 1, borderBottomColor: '#BBF7D0', backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#14532D' },
  content: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#14532D', textAlign: 'center', marginBottom: 10 },
  subTitle: { fontSize: 16, color: '#166534', textAlign: 'center', paddingHorizontal: 20 },
  grid: { gap: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 25, borderWidth: 1, borderColor: '#BBF7D0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, alignItems: 'flex-start' },
  iconBox: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#14532D', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#166534', lineHeight: 20, marginBottom: 20 },
  arrowBox: { marginTop: 'auto', alignSelf: 'flex-end' }
});
