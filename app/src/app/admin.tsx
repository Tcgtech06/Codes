import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

// Temporary Mock Data
const MOCK_PENDING = [
  { id: 'p1', name: 'Royal Knitwear', address: 'PN Road, Tiruppur', phone: '+919876543212', type: 'Dyeing', date: '12 Jul 2026' },
  { id: 'p2', name: 'Supreme Threads', address: 'Avinashi Road, Tiruppur', phone: '+919988776655', type: 'Knitting', date: '12 Jul 2026' }
];

const MOCK_ADS_INITIAL = [
  { id: 'a1', title: 'TCG Tech Software', status: 'Active', impressions: 1240, link: 'https://tcgtech.in', image: 'https://picsum.photos/seed/tcg/800/400' },
  { id: 'a2', title: 'Best Garment Machines', status: 'Inactive', impressions: 0, link: 'https://wa.me/919876543210', image: 'https://picsum.photos/seed/machine/800/400' }
];

export default function AdminDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWebOrTablet = width > 768;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [chartType, setChartType] = useState('bar');

  const [activeTab, setActiveTab] = useState('overview'); // overview, pending, ads, companies

  const [ads, setAds] = useState(MOCK_ADS_INITIAL);
  const [showAddAd, setShowAddAd] = useState(false);
  const [newAd, setNewAd] = useState({ title: '', link: '', image: '' });

  const t = {
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent1: '#10B981', // Emerald
    accent2: '#0EA5E9', // Sky Blue
    danger: '#EF4444',
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Thala, incorrect password! Try "admin" 😉');
    }
  };

  const handleAddAd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!newAd.title || !newAd.link) return alert('Title and Link are required!');
    const ad = {
      id: 'a' + Date.now(),
      title: newAd.title,
      status: 'Active',
      impressions: 0,
      link: newAd.link,
      image: newAd.image || 'https://picsum.photos/seed/' + Date.now() + '/800/400'
    };
    setAds([ad, ...ads]);
    setNewAd({ title: '', link: '', image: '' });
    setShowAddAd(false);
  };

  const deleteAd = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAds(ads.filter(a => a.id !== id));
  };

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
      {['overview', 'pending', 'ads', 'companies'].map((tab) => (
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

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Platform Analytics</Text>

      {/* Stats Cards */}
      <View style={{ flexDirection: isWebOrTablet ? 'row' : 'column', gap: 12, marginBottom: 24 }}>
        <View style={[styles.card, { flex: 1, backgroundColor: t.accent1 }]}>
          <Text style={{ color: '#D1FAE5', fontSize: 14, fontWeight: 'bold' }}>Total Users</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>12,450</Text>
        </View>
        <View style={[styles.card, { flex: 1, backgroundColor: t.accent2 }]}>
          <Text style={{ color: '#E0F2FE', fontSize: 14, fontWeight: 'bold' }}>WhatsApp Clicks</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>3,240</Text>
        </View>
        <View style={[styles.card, { flex: 1, backgroundColor: t.textPrimary }]}>
          <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: 'bold' }}>Active Companies</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>480</Text>
        </View>
      </View>

      {/* Dynamic Charts */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={styles.cardTitle}>Traffic Overview</Text>
            <Text style={styles.cardSub}>Platform metrics</Text>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: t.bg, borderRadius: 8, padding: 4 }}>
             <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setChartType('bar'); }} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: chartType === 'bar' ? '#fff' : 'transparent', borderRadius: 4, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: chartType === 'bar' ? 0.05 : 0 }}><Text style={{fontSize:12, fontWeight: chartType==='bar'?'bold':'normal', color: chartType==='bar'?t.accent1:t.textSecondary}}>Bar</Text></TouchableOpacity>
             <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setChartType('line'); }} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: chartType === 'line' ? '#fff' : 'transparent', borderRadius: 4, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: chartType === 'line' ? 0.05 : 0 }}><Text style={{fontSize:12, fontWeight: chartType==='line'?'bold':'normal', color: chartType==='line'?t.accent1:t.textSecondary}}>Line</Text></TouchableOpacity>
             <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setChartType('pie'); }} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: chartType === 'pie' ? '#fff' : 'transparent', borderRadius: 4, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: chartType === 'pie' ? 0.05 : 0 }}><Text style={{fontSize:12, fontWeight: chartType==='pie'?'bold':'normal', color: chartType==='pie'?t.accent1:t.textSecondary}}>Pie</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'center', overflow: 'hidden' }}>
          {chartType === 'bar' && <BarChart data={{ labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ data: [40, 60, 45, 80, 55, 90, 75] }] }} width={isWebOrTablet ? 700 : width - 64} height={220} yAxisLabel="" yAxisSuffix="" chartConfig={{ backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, labelColor: () => t.textSecondary, barPercentage: 0.6 }} style={{ borderRadius: 8, marginVertical: 8 }} />}
          {chartType === 'line' && <LineChart data={{ labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ data: [40, 60, 45, 80, 55, 90, 75] }] }} width={isWebOrTablet ? 700 : width - 64} height={220} yAxisLabel="" yAxisSuffix="" chartConfig={{ backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, labelColor: () => t.textSecondary }} bezier style={{ borderRadius: 8, marginVertical: 8 }} />}
          {chartType === 'pie' && <PieChart data={[ { name: 'Users', population: 12450, color: t.accent1, legendFontColor: t.textSecondary }, { name: 'Clicks', population: 3240, color: t.accent2, legendFontColor: t.textSecondary }, { name: 'Companies', population: 480, color: t.textPrimary, legendFontColor: t.textSecondary } ]} width={isWebOrTablet ? 700 : width - 64} height={220} chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }} accessor="population" backgroundColor="transparent" paddingLeft="15" absolute />}
        </View>
      </View>
    </View>
  );

  const renderPending = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Requires Approval ({MOCK_PENDING.length})</Text>
      {MOCK_PENDING.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.address} • {item.type}</Text>
              <Text style={styles.cardSub}>{item.phone}</Text>
              <Text style={{ fontSize: 11, color: t.textSecondary, marginTop: 4 }}>Submitted: {item.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="close" size={20} color={t.danger} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' }]}>
                <Ionicons name="checkmark" size={20} color={t.accent1} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAds = () => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Ad Campaigns</Text>
        <TouchableOpacity onPress={() => setShowAddAd(!showAddAd)} style={{ backgroundColor: t.accent1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name={showAddAd ? "close" : "add"} size={16} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{showAddAd ? "Cancel" : "New Ad"}</Text>
        </TouchableOpacity>
      </View>

      {showAddAd && (
        <View style={[styles.card, { backgroundColor: '#F8FAFC', borderColor: t.accent1 }]}>
          <Text style={[styles.cardTitle, { color: t.accent1 }]}>Upload New Banner Ad</Text>
          <Text style={[styles.cardSub, { marginBottom: 16 }]}>Recommended Size: 1080x400px (Banner) or 1080x1080px (Square)</Text>

          <TextInput
            placeholder="Ad Campaign Title"
            style={styles.input}
            value={newAd.title}
            onChangeText={(t) => setNewAd({ ...newAd, title: t })}
          />
          <TextInput
            placeholder="Hyperlink or WhatsApp URL (e.g. https://wa.me/...)"
            style={styles.input}
            value={newAd.link}
            onChangeText={(t) => setNewAd({ ...newAd, link: t })}
            autoCapitalize="none"
          />
          <TouchableOpacity style={{ backgroundColor: t.border, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: t.textSecondary }}>
            <Ionicons name="image" size={24} color={t.textSecondary} />
            <Text style={{ color: t.textSecondary, fontWeight: 'bold', marginTop: 4 }}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddAd} style={{ backgroundColor: t.accent1, padding: 12, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Campaign</Text>
          </TouchableOpacity>
        </View>
      )}

      {ads.map(ad => (
        <View key={ad.id} style={styles.card}>
          <Image source={{ uri: ad.image }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 12, backgroundColor: t.border }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.cardTitle}>{ad.title}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(ad.link)}>
                <Text style={[styles.cardSub, { color: t.accent2, textDecorationLine: 'underline' }]} numberOfLines={1}>{ad.link}</Text>
              </TouchableOpacity>
              <Text style={styles.cardSub}>{ad.impressions} Impressions • {ad.status}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}>
                <Ionicons name="pencil" size={18} color={t.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAd(ad.id)} style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                <Ionicons name="trash" size={18} color={t.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <Stack.Screen options={{
        headerShown: true,
        title: isAuthenticated ? 'Master Admin Panel' : 'Admin Login',
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.textPrimary,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'web' ? 20 : 0 }}>
            <Ionicons name="arrow-back" size={24} color={t.textPrimary} />
          </TouchableOpacity>
        )
      }} />

      {!isAuthenticated ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={[styles.card, { width: '100%', maxWidth: 400, padding: 24, alignItems: 'center' }]}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="lock-closed" size={30} color={t.accent2} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: t.textPrimary, marginBottom: 8 }}>Admin Login</Text>
            <Text style={{ color: t.textSecondary, marginBottom: 24, textAlign: 'center' }}>Enter your master password to access the platform controls.</Text>

            <TextInput
              style={[styles.input, { width: '100%' }]}
              placeholder="Enter Password (admin)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: t.accent1, width: '100%', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Secure Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, isWebOrTablet && { alignSelf: 'center', width: '100%', maxWidth: 800 }]}>
          {renderTabs()}

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'pending' && renderPending()}
          {activeTab === 'ads' && renderAds()}
          {activeTab === 'companies' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manage Database</Text>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Full CRUD Access</Text>
                <Text style={styles.cardSub}>Search and edit all approved company records here.</Text>
                <View style={{ marginTop: 12, flexDirection: 'row', backgroundColor: t.bg, borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: t.border }}>
                  <Ionicons name="search" size={20} color={t.textSecondary} style={{ marginHorizontal: 8 }} />
                  <TextInput placeholder="Search companies..." style={{ flex: 1, outlineStyle: 'none' as any }} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 20
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16
  },
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  }
});
