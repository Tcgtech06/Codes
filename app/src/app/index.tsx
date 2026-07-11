import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform, TextInput, useWindowDimensions, KeyboardAvoidingView, Pressable, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tLight = {
  name: 'TCG Corporate',
  bg: '#F9FAFB', // Clean light background
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937', // Dark grey text
  textSecondary: '#6B7280',
  accent1: '#60A5FA', // Pastel Blue
  accent2: '#F59E0B', // TCG Yellow (For ratings/stars)
  border: '#E5E7EB',
  sidebarBg: '#FFFFFF'
};

const tDark = {
  name: 'TCG Dark',
  bg: '#111827', // Deep grey/black
  cardBg: '#1F2937', // Slightly lighter grey for cards
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent1: '#93C5FD', // Lighter Pastel Blue
  accent2: '#FBBF24', // TCG Yellow
  border: '#374151',
  sidebarBg: '#111827'
};

const HotDogMenu = ({ isOpen }: { isOpen?: boolean }) => (
  <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
    <View style={[{ width: isOpen ? 28 : 20, height: 5, borderRadius: 3, backgroundColor: '#EF4444', position: 'absolute' }, isOpen ? { top: 11.5, transform: [{ rotate: '45deg' }] } : { top: 4 }]} />
    <View style={[{ width: 28, height: 5, borderRadius: 3, backgroundColor: '#22C55E', position: 'absolute', top: 11.5 }, isOpen ? { opacity: 0 } : {}]} />
    <View style={[{ width: isOpen ? 28 : 20, height: 5, borderRadius: 3, backgroundColor: '#F59E0B', position: 'absolute' }, isOpen ? { top: 11.5, transform: [{ rotate: '-45deg' }] } : { top: 19 }]} />
  </View>
);

export default function App() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const t = isDarkMode ? tDark : tLight;
  
  const { width } = useWindowDimensions();
  const isWebOrTablet = width > 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'ai', type: 'text' | 'voice', text: string, duration?: number }[]>([]);
  const hasText = inputText.trim().length > 0;

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTime > 0) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', type: 'voice', text: '', duration: recordingTime }]);
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <StatusBar style="dark" />
      
      <View style={styles.layout}>
        {/* Overlay to close sidebar when tapping outside */}
        {((isWebOrTablet && desktopSidebarOpen) || (!isWebOrTablet && sidebarOpen)) && (
          <Pressable 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 5 }} 
            onPress={() => isWebOrTablet ? setDesktopSidebarOpen(false) : setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        {((isWebOrTablet && desktopSidebarOpen) || (!isWebOrTablet && sidebarOpen)) && (
          <View style={[styles.sidebar, { backgroundColor: t.sidebarBg, borderRightColor: t.border }, { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10 }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.sidebarTitle, { color: t.textPrimary }]}>Tiruppur AI</Text>
              {isWebOrTablet ? (
                <TouchableOpacity onPress={() => setDesktopSidebarOpen(false)}>
                  <HotDogMenu isOpen={true} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                  <HotDogMenu isOpen={true} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setMessages([])} style={[styles.newChatBtn, { backgroundColor: t.accent1 }]}>
              <Ionicons name="add" size={20} color="#0F172A" />
              <Text style={{ color: '#0F172A', fontWeight: 'bold', marginLeft: 8 }}>New Chat</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.historyList}>
              <Text style={[styles.historySection, { color: t.textSecondary }]}>Recent</Text>
              <TouchableOpacity style={styles.historyItem}>
                <Ionicons name="chatbubble-outline" size={18} color={t.textPrimary} />
                <Text style={[styles.historyText, { color: t.textPrimary }]} numberOfLines={1}>1000 Cotton Shirts Dyeing...</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.historyItem}>
                <Ionicons name="chatbubble-outline" size={18} color={t.textPrimary} />
                <Text style={[styles.historyText, { color: t.textPrimary }]} numberOfLines={1}>Best Knitting Units Tiruppur</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Branding */}
            <View style={{ marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: t.border, alignItems: 'center' }}>
              <Text style={{ color: t.textSecondary, fontSize: 12 }}>A product of</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 2 }}>
                <Text style={{ color: '#EF4444' }}>T</Text>
                <Text style={{ color: '#22C55E' }}>C</Text>
                <Text style={{ color: '#F59E0B' }}>G</Text>
                <Text style={{ color: '#3B82F6' }}> TECH</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Main Chat Area */}
        <View style={[styles.mainContent, { backgroundColor: t.bg }]}>
          
          {/* Main Header */}
          <View style={[styles.mobileHeader, { borderBottomColor: t.border, backgroundColor: t.bg }]}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               {isWebOrTablet ? (
                 <TouchableOpacity onPress={() => setDesktopSidebarOpen(true)} style={{ opacity: desktopSidebarOpen ? 0 : 1 }}>
                   <Text style={[styles.mobileHeaderTitle, { color: t.textPrimary, fontSize: 20 }]}>Tiruppur AI</Text>
                 </TouchableOpacity>
               ) : (
                 <TouchableOpacity onPress={() => setSidebarOpen(true)} style={{ opacity: sidebarOpen ? 0 : 1, marginRight: 15 }}>
                   <HotDogMenu />
                 </TouchableOpacity>
               )}
               {!isWebOrTablet && (
                 <Text style={[styles.mobileHeaderTitle, { color: t.textPrimary }]}>Tiruppur AI</Text>
               )}
             </View>

             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
               <TouchableOpacity onPress={() => router.push('/add-data')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                 <Ionicons name="cloud-upload-outline" size={20} color={t.accent1} />
                 {isWebOrTablet && <Text style={{ color: t.accent1, fontWeight: 'bold' }}>Add Data</Text>}
               </TouchableOpacity>

               <TouchableOpacity onPress={() => router.push('/advertise')} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                 <Ionicons name="megaphone-outline" size={20} color={t.accent2} />
                 {isWebOrTablet && <Text style={{ color: t.accent2, fontWeight: 'bold' }}>Advertise</Text>}
               </TouchableOpacity>

               <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                 <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={t.textPrimary} />
               </TouchableOpacity>
             </View>
          </View>

          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={[styles.chatArea, isWebOrTablet && { paddingHorizontal: '10%', paddingVertical: 40 }]}>
              
              {/* User Message */}
              <View style={styles.userMessageRow}>
                <View style={[styles.messageBubble, styles.userBubble, { backgroundColor: t.accent1, borderBottomRightRadius: 4 }]}>
                  <Text style={{ color: '#0F172A', fontSize: 16, lineHeight: 24 }}>Enaku 1000 cotton shirts dyeing panna oru nalla company venum Avinashi road la.</Text>
                </View>
              </View>
              
              {/* AI Response */}
              <View style={[styles.aiMessageRow, { alignItems: 'flex-start' }]}>
                <View style={[styles.aiAvatar, { backgroundColor: t.cardBg, borderColor: t.border, borderWidth: 1 }]}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: t.accent1 }}>T</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12, paddingTop: 4 }}>
                  <Text style={{ color: t.textPrimary, fontSize: 16, lineHeight: 26, marginBottom: 15 }}>Avinashi Road-la 3 nalla Dyeing Units iruku:</Text>
                  
                  {/* Example Card */}
                  <View style={[styles.companyCard, { borderColor: t.border, backgroundColor: t.bg }]}>
                    <View style={styles.cardHeader}>
                      <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: 16 }}>Sri Balaji Dyeing</Text>
                      <Text style={{ color: t.accent2, fontWeight: 'bold' }}>★ 4.8</Text>
                    </View>
                    <Text style={{ color: t.textSecondary, fontSize: 14, marginVertical: 6 }}>Avinashi Road, Tiruppur</Text>
                    
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: t.accent1 }]}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Call Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderColor: t.accent1, borderWidth: 1 }]}>
                        <Text style={{ color: t.accent1, fontSize: 14, fontWeight: '600' }}>WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Example Card 2 */}
                  <View style={[styles.companyCard, { borderColor: t.border, backgroundColor: t.bg }]}>
                    <View style={styles.cardHeader}>
                      <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: 16 }}>KGM Dyeing Mill</Text>
                      <Text style={{ color: t.accent2, fontWeight: 'bold' }}>★ 4.5</Text>
                    </View>
                    <Text style={{ color: t.textSecondary, fontSize: 14, marginVertical: 6 }}>Avinashi Road, Tiruppur</Text>
                    
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: t.accent1 }]}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Call Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderColor: t.accent1, borderWidth: 1 }]}>
                        <Text style={{ color: t.accent1, fontSize: 14, fontWeight: '600' }}>WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {/* Dynamic Messages */}
              {messages.map(msg => (
                <View key={msg.id} style={[msg.role === 'user' ? styles.userMessageRow : styles.aiMessageRow, msg.role === 'ai' && { alignItems: 'flex-start' }]}>
                  {msg.role === 'ai' && (
                     <View style={[styles.aiAvatar, { backgroundColor: t.cardBg, borderColor: t.border, borderWidth: 1 }]}>
                       <Text style={{ fontSize: 16, fontWeight: 'bold', color: t.accent1 }}>T</Text>
                     </View>
                  )}
                  <View style={msg.role === 'user' ? [styles.messageBubble, styles.userBubble, { backgroundColor: t.accent1, borderBottomRightRadius: 4 }] : { flex: 1, paddingLeft: 12, paddingTop: 4 }}>
                    {msg.type === 'text' ? (
                       <Text style={{ color: msg.role === 'user' ? '#0F172A' : t.textPrimary, fontSize: 16, lineHeight: 24 }}>{msg.text}</Text>
                    ) : (
                       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                         <Ionicons name="play-circle" size={32} color={msg.role === 'user' ? '#0F172A' : t.textPrimary} />
                         <View style={{ height: 4, width: 100, backgroundColor: msg.role === 'user' ? 'rgba(15,23,42,0.3)' : t.border, borderRadius: 2 }} />
                         <Text style={{ color: msg.role === 'user' ? '#0F172A' : t.textPrimary, fontSize: 14 }}>{formatTime(msg.duration || 0)}</Text>
                       </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Bottom Input Area */}
            <View style={[styles.bottomContainer, isWebOrTablet && { paddingHorizontal: '10%' }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={{ paddingHorizontal: 15 }}>
                <TouchableOpacity style={[styles.chip, { backgroundColor: t.cardBg, borderColor: t.border }]}>
                   <Text style={{ color: t.textSecondary, fontSize: 14 }}>Knitting Units</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.chip, { backgroundColor: t.cardBg, borderColor: t.border }]}>
                   <Text style={{ color: t.textSecondary, fontSize: 14 }}>Compact Yarn</Text>
                </TouchableOpacity>
              </ScrollView>
              
              <View style={[styles.inputWrapper, { backgroundColor: t.cardBg, borderColor: t.border, alignItems: 'center' }]}>
                {isRecording ? (
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 40 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginRight: 10 }} />
                    <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: 'bold' }}>Recording... {formatTime(recordingTime)}</Text>
                  </View>
                ) : (
                  <TextInput 
                    style={[styles.textInput, { color: t.textPrimary, paddingHorizontal: 0 }]} 
                    placeholderTextColor={t.textSecondary}
                    placeholder="Ask Tiruppur AI..."
                    multiline
                    value={inputText}
                    onChangeText={setInputText}
                  />
                )}
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  {/* Mic Button (Left of Send Button) */}
                  <TouchableOpacity 
                    onPress={() => setIsRecording(!isRecording)}
                    style={[
                      styles.actionIconBtn, 
                      !isWebOrTablet && { width: 34, height: 34, borderRadius: 17, marginBottom: 0 }, 
                      { backgroundColor: isRecording ? '#EF4444' : t.accent1, marginRight: 8 }
                    ]}
                  >
                    <Ionicons name={isRecording ? "stop" : "mic"} size={isWebOrTablet ? 20 : 16} color="#fff" />
                  </TouchableOpacity>
                  
                  {/* Send Button */}
                  <TouchableOpacity 
                    style={[
                      styles.actionIconBtn, 
                      !isWebOrTablet && { width: 34, height: 34, borderRadius: 17, marginBottom: 0 }, 
                      { backgroundColor: hasText ? t.accent1 : '#E2E8F0' }
                    ]} 
                    disabled={!hasText}
                  >
                    <Ionicons name="arrow-up" size={isWebOrTablet ? 20 : 16} color={hasText ? "#fff" : "#94A3B8"} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.disclaimer, { color: t.textSecondary }]}>Tiruppur AI can make mistakes. Verify important information.</Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  layout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 280, borderRightWidth: 1, padding: 20, paddingTop: Platform.OS === 'web' ? 20 : 50 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  sidebarTitle: { fontSize: 22, fontWeight: '900' },
  newChatBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, justifyContent: 'center', marginBottom: 20 },
  historyList: { flex: 1 },
  historySection: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginTop: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  historyText: { fontSize: 14, flex: 1 },
  
  mainContent: { flex: 1 },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, paddingTop: Platform.OS === 'web' ? 15 : 50, borderBottomWidth: 1 },
  mobileHeaderTitle: { fontSize: 18, fontWeight: 'bold' },
  
  chatArea: { padding: 15, paddingBottom: 150 },
  messageBubble: { padding: 16, borderRadius: 20, maxWidth: '90%' },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 25 },
  aiMessageRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 25, gap: 10 },
  aiAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 5 },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4, maxWidth: '85%' },
  
  companyCard: { marginTop: 15, padding: 16, borderRadius: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  
  bottomContainer: { position: 'absolute', bottom: 0, width: '100%', paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: 'transparent' },
  chipsRow: { flexDirection: 'row', marginBottom: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginHorizontal: 15, borderRadius: 25, borderWidth: 1, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  textInput: { flex: 1, minHeight: 40, maxHeight: 120, paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 10 : 8, fontSize: 16, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  actionIconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  disclaimer: { textAlign: 'center', fontSize: 11, marginTop: 10 }
});
