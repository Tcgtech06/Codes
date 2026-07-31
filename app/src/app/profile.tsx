import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
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

  const handleSettings = () => {
    Alert.alert("Settings", "Settings page coming soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#3B82F6" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user ? (user.displayName || user.phoneNumber || 'User') : 'Guest User'}</Text>
            {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
          </View>
        </View>

        {/* Auth Actions */}
        <View style={styles.section}>
          {!user ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/login')}>
              <Ionicons name="log-in-outline" size={20} color="#FFF" />
              <Text style={styles.btnPrimaryText}>Login / Sign Up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnDanger} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.btnDangerText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Legal</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <Ionicons name="settings-outline" size={20} color="#475569" />
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/privacy')}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#475569" />
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/terms')}>
              <Ionicons name="document-text-outline" size={20} color="#475569" />
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat History</Text>
          {loadingHistory ? (
            <ActivityIndicator size="small" color="#3B82F6" style={{ marginTop: 20 }} />
          ) : history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="chatbubble-ellipses-outline" size={30} color="#CBD5E1" />
              <Text style={styles.emptyText}>No chat history found.</Text>
            </View>
          ) : (
            <View style={styles.menuGroup}>
              {history.map((chat, idx) => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={[styles.historyItem, idx === history.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => router.replace({ pathname: '/chat', params: { chatId: chat.id } })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle} numberOfLines={1}>{chat.title || 'Conversation'}</Text>
                    <Text style={styles.historyDate}>{new Date(chat.updatedAt).toLocaleDateString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  content: { padding: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  userEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#334155', marginBottom: 10, marginLeft: 4 },
  btnPrimary: { flexDirection: 'row', backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnDanger: { flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnDangerText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
  menuGroup: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuText: { flex: 1, fontSize: 16, color: '#1E293B', marginLeft: 12 },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  historyTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  historyDate: { fontSize: 13, color: '#94A3B8' },
  emptyHistory: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  emptyText: { marginTop: 10, fontSize: 14, color: '#94A3B8' }
});
