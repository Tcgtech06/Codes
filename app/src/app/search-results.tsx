import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Linking, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SEARCH_RESULTS } from './index';

const tLight = {
  name: 'Pastel Mint',
  bg: '#F9FAFB',
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accent1: '#34D399',
  accent2: '#FBBF24',
  border: '#E5E7EB',
};

const tDark = {
  name: 'Midnight Mint',
  bg: '#0F172A',
  cardBg: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accent1: '#10B981',
  accent2: '#FBBF24',
  border: '#334155',
};

export default function SearchResults() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const t = isDarkMode ? tDark : tLight;
  const { width } = useWindowDimensions();
  const isWebOrTablet = width > 768;
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg },
    header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: t.cardBg, borderBottomWidth: 1, borderBottomColor: t.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: t.textPrimary, marginLeft: 16 },
    content: { padding: 20 },
    companyCard: { marginBottom: 15, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
    actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="arrow-back" size={24} color={t.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Dyeing Units ({SEARCH_RESULTS.length})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {SEARCH_RESULTS.map(company => (
          <TouchableOpacity key={company.id} activeOpacity={0.8} onPress={() => setSelectedCompany(company)} style={[styles.companyCard, { borderColor: t.border, backgroundColor: t.cardBg, padding: isWebOrTablet ? 16 : 10 }, isWebOrTablet && { alignSelf: 'center', width: '100%', maxWidth: 600 }]}>
            {company.ad && (
              <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 10 }}>
                <Text style={{ color: '#D97706', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: isWebOrTablet ? 16 : 13 }}>{company.name}</Text>
                {company.verified && <MaterialIcons name="verified" size={isWebOrTablet ? 16 : 13} color="#3B82F6" />}
              </View>
            </View>
            <Text style={{ color: t.textSecondary, fontSize: isWebOrTablet ? 14 : 11, marginVertical: 4 }}>{company.address}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${company.phone}`)} style={[styles.actionBtn, { backgroundColor: t.accent1 }]}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${company.phone.replace(/[^0-9]/g, '')}`)} style={[styles.actionBtn, { backgroundColor: 'transparent', borderColor: t.accent1, borderWidth: 1 }]}>
                <Text style={{ color: t.accent1, fontSize: 14, fontWeight: '600' }}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedCompany} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: t.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%', overflow: 'hidden' }}>
            {selectedCompany?.ad && (
              <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 16, paddingVertical: 6, borderBottomLeftRadius: 16, zIndex: 10 }}>
                <Text style={{ color: '#D97706', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: t.textPrimary }}>{selectedCompany?.name}</Text>
                  {selectedCompany?.verified && <MaterialIcons name="verified" size={20} color="#3B82F6" />}
                </View>
                <Text style={{ color: t.textSecondary, fontSize: 14 }}>{selectedCompany?.address}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCompany(null)} style={{ padding: 4, backgroundColor: t.bg, borderRadius: 15, zIndex: 20, marginTop: selectedCompany?.ad ? 28 : 0 }}>
                <Ionicons name="close" size={24} color={t.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: t.textPrimary, marginBottom: 12 }}>Products & Services</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {selectedCompany?.products?.map((prod: string, i: number) => {
                  const colors = [
                    { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' },
                    { bg: '#F3E8FF', text: '#581C87', border: '#E9D5FF' },
                    { bg: '#FCE7F3', text: '#831843', border: '#FBCFE8' },
                  ];
                  const c = colors[i % colors.length];
                  return (
                    <View key={i} style={{ backgroundColor: c.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: c.border }}>
                      <Text style={{ color: c.text, fontSize: 13, fontWeight: '500' }}>{prod}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={{ backgroundColor: t.bg, padding: 16, borderRadius: 12, marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: t.textSecondary, marginBottom: 8 }}>Match Score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4 }}>
                    <View style={{ width: selectedCompany?.match || '90%', height: '100%', backgroundColor: '#10B981', borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10B981' }}>{selectedCompany?.match || '90%'}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedCompany?.phone}`)} style={{ flex: 1, backgroundColor: t.accent1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Call Now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${selectedCompany?.phone?.replace(/[^0-9]/g, '')}`)} style={{ flex: 1, backgroundColor: 'transparent', borderColor: t.accent1, borderWidth: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: t.accent1, fontSize: 16, fontWeight: 'bold' }}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
