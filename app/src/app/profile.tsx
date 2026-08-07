import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, colors } = useTheme();
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || user.uid === 'guest') {
        setHistory([]);
        setLoadingHistory(false);
        return;
      }
      try {
        const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const chats = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        chats.sort((a, b) => b.updatedAt - a.updatedAt);
        setHistory(chats);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.cardBg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Prominent Center User Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={colors.accent} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user ? (user.displayName || user.phoneNumber || 'User') : 'Guest User'}</Text>
          {user?.email ? (
            <Text style={styles.userEmail}>{user.email}</Text>
          ) : (
            <Text style={styles.userEmail}>Welcome to Tiruppur AI</Text>
          )}
          
          {!user && (
            <TouchableOpacity style={styles.loginBadge} onPress={() => router.push('/login')}>
              <Text style={styles.loginBadgeText}>Login Now</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats or Features (Optional native app feel) */}
        {user && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>Pro</Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
          </View>
        )}

        {/* Links Section */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF' }]}>
              <Ionicons name="settings-outline" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/privacy')}>
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#064E3B' : '#ECFDF5' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/terms')}>
            <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#7F1D1D' : '#FEF2F2' }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.danger} />
            </View>
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Chat History Section */}
        {user && (
          <>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent Chats</Text>
              {history.length > 0 && (
                <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
              )}
            </View>
            
            {loadingHistory ? (
              <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 20 }} />
            ) : history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.border} />
                <Text style={styles.emptyText}>No recent chats found.</Text>
              </View>
            ) : (
              <View style={styles.menuGroup}>
                {history.slice(0, 5).map((chat, idx) => (
                  <TouchableOpacity 
                    key={chat.id} 
                    style={[styles.historyItem, idx === Math.min(history.length, 5) - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => router.replace({ pathname: '/chat', params: { chatId: chat.id } })}
                  >
                    <View style={styles.historyIconBg}>
                      <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyTitle} numberOfLines={1}>{chat.title || 'Conversation'}</Text>
                      <Text style={styles.historyDate}>{new Date(chat.updatedAt).toLocaleDateString()}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Logout */}
        {user && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  content: { padding: 20, width: '100%', maxWidth: 600, alignSelf: 'center' },
  
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.cardBg,
  },
  userName: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  userEmail: { fontSize: 15, color: colors.textSecondary },
  loginBadge: {
    marginTop: 16,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginLeft: 4, marginTop: 10 },
  menuGroup: { 
    backgroundColor: colors.cardBg, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 24,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary, marginLeft: 16 },
  
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  seeAllText: { color: colors.accent, fontWeight: '600', fontSize: 14 },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  historyDate: { fontSize: 13, color: colors.textSecondary },
  emptyHistory: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: colors.cardBg, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  emptyText: { marginTop: 12, fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  
  logoutBtn: { 
    flexDirection: 'row', 
    backgroundColor: colors.isDark ? '#450a0a' : '#FEF2F2', 
    borderWidth: 1, 
    borderColor: colors.isDark ? '#7f1d1d' : '#FECACA', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    marginTop: 10,
  },
  logoutText: { color: colors.danger, fontSize: 16, fontWeight: '700' },
});
