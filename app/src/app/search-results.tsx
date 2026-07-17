import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { Linking, Modal, PanResponder, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SEARCH_RESULTS } from './index';

const tLight = {
  name: 'Pastel Mint',
  bg: '#F0F9FF',
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accent1: '#34D399',
  accent2: '#FBBF24',
  border: '#86EFAC',
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
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);
  const modalScrollY = useRef(0);

  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 15 && gestureState.vy > 0.2 && modalScrollY.current <= 0;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          setSelectedCompany(null);
        }
      },
    })
  ).current;

  const handleScroll = (event: any) => {
    if (isWebOrTablet) return;
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY < 0) return;

    const diff = currentY - lastScrollY.current;
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      lastScrollY.current = currentY;
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: t.bg },
    header: { position: 'absolute', top: 0, width: '100%', zIndex: 50, paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : (Platform.OS === 'web' ? 20 : 40), paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.cardBg, borderBottomWidth: 1, borderBottomColor: t.border },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: t.textPrimary, marginLeft: 12 },
    content: { padding: 20, paddingTop: Platform.OS === 'ios' ? 110 : 90 },
    companyCard: { marginBottom: 15, borderRadius: 12, borderWidth: 3, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
    actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {(!hideHeader || isWebOrTablet) && (
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginLeft: -4 }}>
              <Ionicons name="arrow-back" size={20} color={t.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Results ({SEARCH_RESULTS.length})</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#D97706', fontSize: 10, fontWeight: 'bold' }}>AD</Text>
            <Text style={{ color: t.textPrimary, fontSize: 12, fontWeight: '600' }}>TCG Tech Ads</Text>
          </View>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={[
          styles.content,
          isWebOrTablet && { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'flex-start' }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {SEARCH_RESULTS.map(company => (
          <TouchableOpacity key={company.id} activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedCompany(company); }} style={[styles.companyCard, { borderColor: t.border, backgroundColor: t.cardBg, padding: isWebOrTablet ? 16 : 10 }, isWebOrTablet && { width: '48%', maxWidth: 400, flexGrow: 1 }]}>
            {!!company.ad && (
              <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 10 }}>
                <Text style={{ color: '#D97706', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
              </View>
            )}
            {(!company.ad && !!company.offer && !!company.offer.toLowerCase().match(/(discount|off|%|rs|flat|free)/)) ? (
              <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#FFF1F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 10, borderWidth: 1, borderColor: '#FDA4AF', flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="pricetag" size={10} color="#E11D48" style={{ marginRight: 4 }} />
                <Text style={{ color: '#BE123C', fontSize: 9, fontWeight: '900' }}>{company.offer.toUpperCase()}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {(company.logo || company.verified) && (
                <View style={{ position: 'relative', marginRight: 12 }}>
                  {!!company.logo && (
                    <Image 
                      source={{ uri: company.logo }} 
                      style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: t.border }} 
                    />
                  )}
                  {company.verified && (
                    <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: t.cardBg, borderRadius: 10, padding: 2 }}>
                      <MaterialIcons name="verified" size={16} color="#3B82F6" />
                    </View>
                  )}
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: isWebOrTablet ? 16 : 13 }}>{company.name}</Text>
                <Text style={{ color: t.textSecondary, fontSize: isWebOrTablet ? 14 : 11, marginTop: 2 }}>{company.address}</Text>
                {company.ad && company.offer && company.offer.toLowerCase().match(/(discount|off|%|rs|flat|free)/) && (
                  <View style={{ alignSelf: 'flex-start', flexDirection: 'row', backgroundColor: '#FFF1F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#FDA4AF', alignItems: 'center', marginTop: 6 }}>
                    <Ionicons name="pricetag" size={12} color="#E11D48" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#BE123C', fontSize: 10, fontWeight: '900' }}>{company.offer}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.cardActions, { marginTop: 4 }]}>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL(`tel:${company.phone}`); }} style={[styles.actionBtn, { backgroundColor: t.accent1, paddingVertical: isWebOrTablet ? 6 : 4, minHeight: 28 }]}>
                <Text style={{ color: '#fff', fontSize: isWebOrTablet ? 12 : 10, fontWeight: '600' }}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL(`https://wa.me/${company.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I found your company on the Tiruppur AI platform. I want to inquire about...`)}`); }} style={[styles.actionBtn, { backgroundColor: 'transparent', borderColor: t.accent1, borderWidth: 1, paddingVertical: isWebOrTablet ? 6 : 4, minHeight: 28 }]}>
                <Text style={{ color: t.accent1, fontSize: isWebOrTablet ? 12 : 10, fontWeight: '600' }}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedCompany} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View {...modalPanResponder.panHandlers} style={{ backgroundColor: t.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%', overflow: 'hidden' }}>
            
            <View>
              <View style={{ width: '100%', alignItems: 'center', paddingBottom: 15, paddingTop: 5 }}>
                <View style={{ width: 40, height: 5, backgroundColor: t.border, borderRadius: 3 }} />
              </View>

              {selectedCompany?.ad && (
                <View style={{ position: 'absolute', top: 12, right: 0, backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 16, paddingVertical: 6, borderBottomLeftRadius: 16, zIndex: 10 }}>
                  <Text style={{ color: '#D97706', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', flex: 1, paddingRight: 10, alignItems: 'center' }}>
                  {(selectedCompany?.logo || selectedCompany?.verified) && (
                    <View style={{ position: 'relative', marginRight: 15 }}>
                      {selectedCompany?.logo && (
                        <Image 
                          source={{ uri: selectedCompany.logo }} 
                          style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: t.border }} 
                        />
                      )}
                      {selectedCompany?.verified && (
                        <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: t.cardBg, borderRadius: 12, padding: 2 }}>
                          <MaterialIcons name="verified" size={20} color="#3B82F6" />
                        </View>
                      )}
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: t.textPrimary, flexShrink: 1 }}>{selectedCompany?.name}</Text>
                    </View>
                    <Text style={{ color: t.textSecondary, fontSize: 13 }}>{selectedCompany?.address}</Text>
                    {!isWebOrTablet && selectedCompany?.offer && selectedCompany.offer.toLowerCase().match(/(discount|off|%|rs|flat|free)/) && (
                      <View style={{ alignSelf: 'flex-start', flexDirection: 'row', backgroundColor: '#FFF1F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FDA4AF', alignItems: 'center', marginTop: 10 }}>
                        <Ionicons name="pricetag" size={14} color="#E11D48" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#BE123C', fontSize: 11, fontWeight: '900' }}>{selectedCompany.offer}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: selectedCompany?.ad ? 28 : 0 }}>
                  {isWebOrTablet && selectedCompany?.offer && selectedCompany.offer.toLowerCase().match(/(discount|off|%|rs|flat|free)/) && (
                    <View style={{ flexDirection: 'row', backgroundColor: '#FFF1F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FDA4AF', alignItems: 'center', marginRight: 12 }}>
                      <Ionicons name="pricetag" size={14} color="#E11D48" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#BE123C', fontSize: 12, fontWeight: '900' }}>{selectedCompany.offer}</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => setSelectedCompany(null)} style={{ padding: 4, backgroundColor: t.bg, borderRadius: 15, zIndex: 20 }}>
                    <Ionicons name="close" size={24} color={t.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              onScroll={(e) => { modalScrollY.current = e.nativeEvent.contentOffset.y; }}
              scrollEventThrottle={16}
            >
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

              {/* Details List */}
              <View style={{ gap: 15, marginBottom: 24 }}>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedCompany?.phone}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: t.bg, borderRadius: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(52, 211, 153, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="call" size={20} color={t.accent1} />
                  </View>
                  <View>
                    <Text style={{ color: t.textSecondary, fontSize: 12 }}>Contact Number</Text>
                    <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }}>{selectedCompany?.phone}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${selectedCompany?.email}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: t.bg, borderRadius: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="mail" size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={{ color: t.textSecondary, fontSize: 12 }}>Email Address</Text>
                    <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }}>{selectedCompany?.email}</Text>
                  </View>
                </TouchableOpacity>

                {selectedCompany?.website && (
                  <TouchableOpacity onPress={() => Linking.openURL(selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: t.bg, borderRadius: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(139, 92, 246, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="globe-outline" size={20} color="#8B5CF6" />
                    </View>
                    <View>
                      <Text style={{ color: t.textSecondary, fontSize: 12 }}>Website</Text>
                      <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }} numberOfLines={1}>{selectedCompany.website}</Text>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => Linking.openURL(`https://maps.google.com/?q=${selectedCompany?.address}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: t.bg, borderRadius: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(239, 68, 68, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="location" size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text style={{ color: t.textSecondary, fontSize: 12 }}>Location</Text>
                    <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }}>{selectedCompany?.address}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
