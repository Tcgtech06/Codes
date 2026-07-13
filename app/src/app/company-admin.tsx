import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Cotton T-Shirt Bulk', category: 'Garments', status: 'Approved', price: '₹120/piece' },
  { id: '2', name: 'Dyeing Chemical XYZ', category: 'Chemicals', status: 'Pending', price: '₹500/liter' }
];

const MOCK_GALLERY = [
  { id: 'img1', type: 'Logo', uri: 'https://picsum.photos/seed/logo/200/200', status: 'Approved' },
  { id: 'img2', type: 'Factory', uri: 'https://picsum.photos/seed/factory/400/300', status: 'Pending' }
];

export default function CompanyAdmin() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWebOrTablet = width > 768;

  const [activeTab, setActiveTab] = useState('profile'); // profile, gallery, data
  
  const [profile, setProfile] = useState({ name: 'Royal Knitwear', address: 'PN Road, Tiruppur', phone: '+919876543212', type: 'Dyeing', gst: '33AABCU9603R1ZN' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [gallery, setGallery] = useState(MOCK_GALLERY);

  const t = {
    bg: '#F0FDF4', // Pastel Green
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent1: '#10B981', // Emerald
    accent2: '#0EA5E9', // Sky Blue
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'profile': return 'business-outline';
      case 'gallery': return 'images-outline';
      case 'data': return 'list-outline';
      default: return 'ellipse-outline';
    }
  };

  const renderSidebar = () => (
    <View style={{ width: 260, backgroundColor: t.cardBg, borderRightWidth: 1, borderColor: t.border, paddingVertical: 24, height: '100%' }}>
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: t.textSecondary, letterSpacing: 1, marginLeft: 24, marginBottom: 16, textTransform: 'uppercase' }}>Company Panel</Text>
      {['profile', 'gallery', 'data'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab(tab); }}
          style={[{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, activeTab === tab && { backgroundColor: '#ECFDF5', borderRightWidth: 4, borderColor: t.accent1 }]}
        >
          <Ionicons name={getTabIcon(tab) as any} size={22} color={activeTab === tab ? t.accent1 : t.textSecondary} />
          <Text style={[{ fontSize: 15 }, activeTab === tab ? { color: t.accent1, fontWeight: 'bold' } : { color: t.textSecondary }]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
      {['profile', 'gallery', 'data'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab(tab); }}
          style={[styles.tab, activeTab === tab && { borderBottomColor: t.accent1 }]}
        >
          <Text style={[styles.tabText, activeTab === tab ? { color: t.accent1, fontWeight: 'bold' } : { color: t.textSecondary }]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProfile = () => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Company Profile</Text>
        <TouchableOpacity 
          onPress={() => setIsEditingProfile(!isEditingProfile)} 
          style={{ backgroundColor: isEditingProfile ? t.border : t.accent1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
        >
          <Text style={{ color: isEditingProfile ? t.textPrimary : '#fff', fontWeight: 'bold', fontSize: 13 }}>
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="information-circle" size={20} color={t.warning} />
          <Text style={{ color: '#92400E', fontSize: 13, flex: 1 }}>Note: Any changes made to your profile will be sent to the Master Admin for approval before going live.</Text>
        </View>

        {Object.entries(profile).map(([key, value]) => (
          <View key={key} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: t.textSecondary, textTransform: 'uppercase', marginBottom: 4 }}>{key}</Text>
            {isEditingProfile ? (
              <TextInput 
                style={styles.input} 
                value={value as string} 
                onChangeText={(text) => setProfile({...profile, [key as keyof typeof profile]: text})} 
              />
            ) : (
              <Text style={{ fontSize: 16, color: t.textPrimary, fontWeight: '500' }}>{value}</Text>
            )}
          </View>
        ))}

        {isEditingProfile && (
          <TouchableOpacity style={{ backgroundColor: t.accent1, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit for Approval</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderGallery = () => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Images & Logo</Text>
        <TouchableOpacity style={{ backgroundColor: t.accent1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="cloud-upload" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Upload New</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: isWebOrTablet ? 'row' : 'column', flexWrap: 'wrap', gap: 16 }}>
        {gallery.map(img => (
          <View key={img.id} style={[styles.card, isWebOrTablet && { flex: 1, minWidth: 250, marginBottom: 0 }]}>
            <Image source={{ uri: img.uri }} style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 12, backgroundColor: t.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.cardTitle}>{img.type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: img.status === 'Approved' ? t.accent1 : t.warning }} />
                  <Text style={{ fontSize: 12, color: t.textSecondary }}>{img.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="trash" size={16} color={t.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderData = () => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Manage Products / Services</Text>
        <TouchableOpacity style={{ backgroundColor: t.accent1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: isWebOrTablet ? 'row' : 'column', flexWrap: 'wrap', gap: 16 }}>
        {products.map(prod => (
          <View key={prod.id} style={[styles.card, isWebOrTablet && { flex: 1, minWidth: 300, marginBottom: 0 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.cardTitle}>{prod.name}</Text>
                <Text style={styles.cardSub}>{prod.category} • {prod.price}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: prod.status === 'Approved' ? t.accent1 : t.warning }} />
                  <Text style={{ fontSize: 12, color: t.textSecondary }}>{prod.status}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}>
                  <Ionicons name="pencil" size={18} color={t.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                  <Ionicons name="trash" size={18} color={t.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <Stack.Screen options={{
        headerShown: true,
        title: 'Company Dashboard',
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.textPrimary,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'web' ? 20 : 0 }}>
            <Ionicons name="arrow-back" size={24} color={t.textPrimary} />
          </TouchableOpacity>
        )
      }} />

      <View style={{ flex: 1, flexDirection: isWebOrTablet ? 'row' : 'column' }}>
        {isWebOrTablet ? renderSidebar() : renderTabs()}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, isWebOrTablet && { padding: 32, maxWidth: 1400, alignSelf: 'center', width: '100%' }]}>
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'gallery' && renderGallery()}
          {activeTab === 'data' && renderData()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  tabContainer: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 20 },
  tab: { paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#64748B', marginBottom: 2 },
  actionBtn: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' && { outlineStyle: 'none' } as any),
  }
});
