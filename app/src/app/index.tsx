import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Linking, Modal, PanResponder, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export const SEARCH_RESULTS = [
  { id: '1', name: 'Sri Balaji Dyeing', verified: true, ad: true, match: '98%', address: 'Avinashi Road, Tiruppur', phone: '+919876543210', email: 'contact@sribalajidyeing.com', products: ['Cotton Shirts Dyeing', 'Polyester Dyeing', 'Garment Dyeing'] },
  { id: '2', name: 'KGM Dyeing Mill', verified: true, ad: false, match: '92%', address: 'Avinashi Road, Tiruppur', phone: '+919123456789', email: 'info@kgmdyeing.com', products: ['Yarn Dyeing', 'Fabric Dyeing'] },
  { id: '3', name: 'Royal Colors', verified: false, ad: false, match: '89%', address: 'Avinashi Road, Tiruppur', phone: '+919876543211', email: 'info@royalcolors.com', products: ['Knitwear Dyeing', 'Woven Dyeing'] },
  { id: '4', name: 'Tiruppur Tech Dyes', verified: true, ad: false, match: '85%', address: 'Avinashi Road, Tiruppur', phone: '+919876543212', email: 'hello@techdyes.com', products: ['Eco-friendly Dyeing', 'Bleaching'] },
  { id: '5', name: 'Modern Dyeing Works', verified: false, ad: false, match: '80%', address: 'Avinashi Road, Tiruppur', phone: '+919876543213', email: 'contact@moderndyeing.com', products: ['Cotton Dyeing'] },
  { id: '6', name: 'Evergreen Textiles', verified: true, ad: false, match: '78%', address: 'PN Road, Tiruppur', phone: '+919876543214', email: 'sales@evergreentextiles.com', products: ['Compact Yarn', 'Fabric Printing'] },
  { id: '7', name: 'Classic Knits', verified: true, ad: true, match: '75%', address: 'Mangalam Road, Tiruppur', phone: '+919876543215', email: 'contact@classicknits.com', products: ['Knitting', 'Compacting'] },
  { id: '8', name: 'Pioneer Dyeing', verified: false, ad: false, match: '70%', address: 'Kangayam Road, Tiruppur', phone: '+919876543216', email: 'info@pioneerdyeing.com', products: ['Yarn Dyeing'] },
  { id: '9', name: 'Vibrant Colors', verified: true, ad: false, match: '68%', address: 'Dharapuram Road, Tiruppur', phone: '+919876543217', email: 'hello@vibrantcolors.com', products: ['Woven Dyeing', 'Garment Dyeing'] },
  { id: '10', name: 'Sunrise Garments', verified: false, ad: false, match: '65%', address: 'Palladam Road, Tiruppur', phone: '+919876543218', email: 'contact@sunrisegarments.com', products: ['Cotton Dyeing', 'Washing'] }
];

const tLight = {
  name: 'SaaS Slate',
  bg: '#F1F5F9', // True Cool Gray background (Slate 100)
  cardBg: '#FFFFFF', // White bubbles
  textPrimary: '#1E293B', // Slate 800 text
  textSecondary: '#64748B', // Slate 500 text
  accent1: '#64748B', // Real Cool Gray for user bubbles (Slate 500)
  accent2: '#94A3B8', // Slate 400
  border: '#E2E8F0', // Slate 200 border
  sidebarBg: '#F8FAFC'
};

const tDark = {
  name: 'Midnight Slate',
  bg: '#0F172A', // Slate 900
  cardBg: '#1E293B', // Slate 800
  textPrimary: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  accent1: '#475569', // Slate 600 for user bubbles in dark mode
  accent2: '#64748B', // Slate 500
  border: '#334155', // Slate 700
  sidebarBg: '#0F172A'
};

const SkeletonLoading = ({ t, isWebOrTablet }: any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, gap: 8, alignItems: 'flex-start' }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.cardBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.border, marginTop: 4 }}>
        <Ionicons name="sparkles" size={16} color={t.accent1} />
      </View>
      <View style={{ flex: 1, paddingLeft: 12, paddingTop: 4 }}>
        <Animated.View style={{ width: 200, height: 20, borderRadius: 6, backgroundColor: t.border, opacity, marginBottom: 15 }} />
        <View style={isWebOrTablet ? { flexDirection: 'row', gap: 16, maxWidth: 816 } : { gap: 12 }}>
          {[1, 2].map(i => (
            <Animated.View key={i} style={[{ height: 140, borderRadius: 12, backgroundColor: t.cardBg, borderColor: t.border, borderWidth: 1, opacity }, isWebOrTablet ? { flex: 1, maxWidth: 400 } : { width: '100%' }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

const HotDogMenu = ({ isOpen, isMobile }: { isOpen?: boolean, isMobile?: boolean }) => (
  <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', transform: [{ scale: isMobile ? 0.85 : 1 }] }}>
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
  const [language, setLanguage] = useState<'EN' | 'TA' | 'HI'>('TA');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'ai', type: 'text' | 'voice', text: string, duration?: number }[]>([]);
  const hasText = inputText.trim().length > 0;
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showPhoneOptions, setShowPhoneOptions] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  const modalScrollY = useRef(0);
  const cardAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current;

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

  useEffect(() => {
    Animated.stagger(150, cardAnims.map(anim => Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }))).start();
  }, []);

  const handleScroll = (event: any) => {
    if (isWebOrTablet) return; // Only apply hide logic on mobile
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY <= 0) {
      setHideHeader(false);
      lastScrollY.current = currentY;
      return;
    }
    const diff = currentY - lastScrollY.current;
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        // Swiping up (scrolling down) - Hide header
        setHideHeader(true);
      } else {
        // Swiping down (scrolling up) - Show header
        setHideHeader(false);
      }
      lastScrollY.current = currentY;
    }
  };

  const renderCard = (company: any, index: number) => {
    const anim = cardAnims[index] || cardAnims[0];
    return (
      <Animated.View key={company.id} style={[{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }, isWebOrTablet && { flex: 1, maxWidth: 400, marginTop: 0 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedCompany(company); }} style={[styles.companyCard, { borderColor: t.border, backgroundColor: t.cardBg, padding: isWebOrTablet ? 16 : 10, overflow: 'hidden' }, isWebOrTablet && { marginTop: 0, borderWidth: 1 }]}>
          {company.ad && (
            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 10, shadowColor: '#FBBF24', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 1 }}>
              <Text style={{ color: '#D97706', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ position: 'relative', marginRight: 12 }}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${company.id}logo/100` }}
                style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: t.border }}
              />
              {company.verified && (
                <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: t.cardBg, borderRadius: 10, padding: 2 }}>
                  <MaterialIcons name="verified" size={16} color="#3B82F6" />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: isWebOrTablet ? 16 : 13 }}>{company.name}</Text>
              <Text style={{ color: t.textSecondary, fontSize: isWebOrTablet ? 14 : 11, marginTop: 2 }}>{company.address}</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL(`tel:${company.phone}`); }} style={[styles.actionBtn, { backgroundColor: t.accent1, paddingVertical: isWebOrTablet ? 10 : 8 }]}>
              <Text style={{ color: '#fff', fontSize: isWebOrTablet ? 14 : 12, fontWeight: '600' }}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL(`https://wa.me/${company.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I found your company on the Tiruppur AI platform. I want to inquire about...`)}`); }} style={[styles.actionBtn, { backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7', borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : '#86EFAC', borderWidth: 1, paddingVertical: isWebOrTablet ? 10 : 8, flexDirection: 'row', gap: 6 }]}>
              <Ionicons name="logo-whatsapp" size={isWebOrTablet ? 18 : 16} color={isDarkMode ? "#4ADE80" : "#16A34A"} />
              <Text style={{ color: isDarkMode ? "#4ADE80" : "#16A34A", fontSize: isWebOrTablet ? 14 : 12, fontWeight: '600' }}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleSend = () => {
    if (!hasText) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMsg = { id: Date.now().toString(), role: 'user', type: 'text', text: inputText } as any;
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsChatLoading(true);
    setTimeout(() => {
      setIsChatLoading(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', type: 'text', text: 'I am still learning! This is a demo UI response for now.' }]);
    }, 1500);
  };

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
          <View style={[styles.sidebar, !isWebOrTablet && { width: 250 }, { backgroundColor: t.sidebarBg, borderRightColor: t.border }, { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10 }]}>
            <View style={styles.sidebarHeader}>
              <Text style={[styles.sidebarTitle, { color: t.textPrimary }]}>Tiruppur AI</Text>
              {isWebOrTablet ? (
                <TouchableOpacity onPress={() => setDesktopSidebarOpen(false)}>
                  <HotDogMenu isOpen={true} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                  <HotDogMenu isOpen={true} isMobile={true} />
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

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Main Header (Absolute) */}
            {(!hideHeader || isWebOrTablet) && (
              <View style={[styles.mobileHeader, { borderBottomColor: t.border, backgroundColor: t.bg }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isWebOrTablet ? (
                    <TouchableOpacity onPress={() => setDesktopSidebarOpen(true)} style={{ opacity: desktopSidebarOpen ? 0 : 1 }}>
                      <Text style={[styles.mobileHeaderTitle, { color: t.textPrimary, fontSize: 20 }]}>Tiruppur AI</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => setSidebarOpen(true)} style={{ opacity: sidebarOpen ? 0 : 1, marginRight: 10 }}>
                      <HotDogMenu isMobile={true} />
                    </TouchableOpacity>
                  )}
                  {!isWebOrTablet && (
                    <Text style={[styles.mobileHeaderTitle, { color: t.textPrimary }]}>Tiruppur AI</Text>
                  )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, paddingRight: 10 }}>
                  <TouchableOpacity onPress={() => router.push('/add-data')} style={{ alignItems: 'center' }}>
                    <Ionicons name="cloud-upload-outline" size={20} color={t.accent1} />
                    <Text style={{ color: t.accent1, fontWeight: 'bold', fontSize: 10, marginTop: 2 }}>Upload</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push('/advertise')} style={{ alignItems: 'center' }}>
                    <Ionicons name="megaphone-outline" size={20} color={t.accent2} />
                    <Text style={{ color: t.accent2, fontWeight: 'bold', fontSize: 10, marginTop: 2 }}>Ads</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={{ alignItems: 'center' }}>
                    <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={20} color={t.textPrimary} />
                    <Text style={{ color: t.textPrimary, fontWeight: 'bold', fontSize: 10, marginTop: 2 }}>Theme</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[styles.chatArea, isWebOrTablet && { paddingHorizontal: '10%', paddingVertical: 40 }, { paddingTop: isWebOrTablet ? 60 : 90 }]}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >

              {/* User Message */}
              <View style={styles.userMessageRow}>
                <View style={[styles.messageBubble, styles.userBubble, { backgroundColor: t.accent1, borderBottomRightRadius: 4, padding: isWebOrTablet ? 16 : 10 }]}>
                  <Text style={{ color: '#FFFFFF', fontSize: isWebOrTablet ? 16 : 13, lineHeight: isWebOrTablet ? 24 : 18 }}>Enaku 1000 cotton shirts dyeing panna oru nalla company venum Avinashi road la.</Text>
                </View>
              </View>

              {/* AI Response */}
              <View style={[styles.aiMessageRow, { alignItems: 'flex-start' }]}>
                <View style={[styles.aiAvatar, { backgroundColor: t.cardBg, borderColor: t.border, borderWidth: 1 }]}>
                  <Ionicons name="sparkles" size={16} color={t.accent1} />
                </View>
                <View style={{ flex: 1, paddingLeft: 12, paddingTop: 4 }}>
                  <Text style={{ color: t.textPrimary, fontSize: isWebOrTablet ? 16 : 13, lineHeight: isWebOrTablet ? 26 : 18, marginBottom: 15 }}>Avinashi Road-la {SEARCH_RESULTS.length} nalla Dyeing Units iruku:</Text>

                  {isWebOrTablet ? (
                    <View style={{ gap: 16, maxWidth: 816 }}>
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        {SEARCH_RESULTS.slice(0, 2).map((c, i) => renderCard(c, i))}
                      </View>
                      {SEARCH_RESULTS.length > 2 && (
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                          {SEARCH_RESULTS.slice(2, 4).map((c, i) => renderCard(c, i + 2))}
                          {SEARCH_RESULTS.length === 3 && <View style={{ flex: 1, maxWidth: 400 }} />}
                        </View>
                      )}
                      {SEARCH_RESULTS.length > 4 && (
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                          <TouchableOpacity onPress={() => router.push('/search-results')} style={{ paddingVertical: 10, paddingHorizontal: 40, backgroundColor: 'transparent', borderWidth: 1, borderColor: t.accent1, borderRadius: 12, alignItems: 'center' }}>
                            <Text style={{ color: t.accent1, fontWeight: 'bold', fontSize: 14 }}>View All {SEARCH_RESULTS.length} Results</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      {SEARCH_RESULTS.slice(0, 4).map((c, i) => renderCard(c, i))}
                      {SEARCH_RESULTS.length > 4 && (
                        <View style={{ marginTop: 10 }}>
                          <TouchableOpacity onPress={() => router.push('/search-results')} style={{ paddingVertical: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: t.accent1, borderRadius: 12, alignItems: 'center' }}>
                            <Text style={{ color: t.accent1, fontWeight: 'bold', fontSize: 14 }}>View All {SEARCH_RESULTS.length} Results</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
              {/* Dynamic Messages */}
              {messages.map(msg => (
                <View key={msg.id} style={[msg.role === 'user' ? styles.userMessageRow : styles.aiMessageRow, msg.role === 'ai' && { alignItems: 'flex-start' }]}>
                  {msg.role === 'ai' && (
                    <View style={[styles.aiAvatar, { backgroundColor: t.cardBg, borderColor: t.border, borderWidth: 1 }]}>
                      <Ionicons name="sparkles" size={16} color={t.accent1} />
                    </View>
                  )}
                  <View style={msg.role === 'user' ? [styles.messageBubble, styles.userBubble, { backgroundColor: t.accent1, borderBottomRightRadius: 4, padding: isWebOrTablet ? 16 : 10 }] : { flex: 1, paddingLeft: isWebOrTablet ? 12 : 8, paddingTop: 4 }}>
                    {msg.type === 'text' ? (
                      <Text style={{ color: msg.role === 'user' ? '#0F172A' : t.textPrimary, fontSize: isWebOrTablet ? 16 : 13, lineHeight: isWebOrTablet ? 24 : 18 }}>{msg.text}</Text>
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
              {isChatLoading && <SkeletonLoading t={t} isWebOrTablet={isWebOrTablet} />}
            </ScrollView>

            {/* Bottom Input Area */}
            <View style={[styles.bottomContainer, isWebOrTablet && { paddingHorizontal: '10%' }, { backgroundColor: t.bg, paddingTop: !hasText ? 12 : 8, borderTopWidth: 1, borderTopColor: t.border }]}>
              {!hasText && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={{ paddingHorizontal: 15 }}>
                  <TouchableOpacity style={[styles.chip, { backgroundColor: t.cardBg, borderColor: t.border }]}>
                    <Text style={{ color: t.textSecondary, fontSize: 12 }}>Knitting Units</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                    <Text style={{ color: '#166534', fontSize: 12, fontWeight: '500' }}>TCG Tech Services</Text>
                    <View style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginLeft: 2, shadowColor: '#FBBF24', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 1 }}>
                      <Text style={{ color: '#D97706', fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5 }}>SPONSORED</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, { backgroundColor: t.cardBg, borderColor: t.border }]}>
                    <Text style={{ color: t.textSecondary, fontSize: 12 }}>Compact Yarn</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}

              <View style={[styles.inputWrapper, { backgroundColor: t.cardBg, borderColor: t.border, alignItems: 'center', alignSelf: 'center', width: isWebOrTablet ? '100%' : '90%' }]}>
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
                    onKeyPress={(e: any) => {
                      if (e.nativeEvent.key === 'Enter' && Platform.OS === 'web') {
                        if (!e.nativeEvent.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }
                    }}
                  />
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  {/* Language Toggle Button */}
                  <View style={{ position: 'relative', zIndex: 50 }}>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowLangMenu(!showLangMenu);
                      }}
                      style={[
                        styles.actionIconBtn,
                        !isWebOrTablet && { width: 32, height: 32, borderRadius: 16, marginBottom: 0 },
                        { backgroundColor: showLangMenu ? t.accent2 : t.cardBg, borderColor: showLangMenu ? t.accent2 : t.border, borderWidth: 1, marginRight: 6 }
                      ]}
                    >
                      <Ionicons name="language" size={isWebOrTablet ? 18 : 16} color={showLangMenu ? '#fff' : t.textPrimary} />
                    </TouchableOpacity>

                    {showLangMenu && (
                      <View style={{ position: 'absolute', bottom: 45, left: -20, backgroundColor: t.cardBg, borderRadius: 12, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 10, borderWidth: 1, borderColor: t.border, minWidth: 100 }}>
                        {['EN', 'TA', 'HI'].map(lang => (
                          <TouchableOpacity
                            key={lang}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLanguage(lang as any); setShowLangMenu(false); }}
                            style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: language === lang ? 'rgba(16, 185, 129, 0.1)' : 'transparent', borderRadius: 8, marginBottom: 2 }}
                          >
                            <Text style={{ color: language === lang ? t.accent2 : t.textPrimary, fontWeight: language === lang ? 'bold' : 'normal', fontSize: 14 }}>{lang === 'EN' ? 'English' : lang === 'TA' ? 'Tamil' : 'Hindi'}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Mic Button (Left of Send Button) */}
                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIsRecording(!isRecording); }}
                    style={[
                      styles.actionIconBtn,
                      !isWebOrTablet && { width: 32, height: 32, borderRadius: 16, marginBottom: 0 },
                      { backgroundColor: isRecording ? '#EF4444' : t.accent1, marginRight: 6 }
                    ]}
                  >
                    <Ionicons name={isRecording ? "stop" : "mic"} size={isWebOrTablet ? 18 : 16} color="#fff" />
                  </TouchableOpacity>

                  {/* Send Button */}
                  <TouchableOpacity
                    onPress={handleSend}
                    style={[
                      styles.actionIconBtn,
                      !isWebOrTablet && { width: 32, height: 32, borderRadius: 16, marginBottom: 0 },
                      { backgroundColor: hasText ? t.accent1 : '#D1FAE5' }
                    ]}
                    disabled={!hasText}
                  >
                    <Ionicons name="arrow-up" size={isWebOrTablet ? 18 : 16} color={hasText ? "#fff" : "#059669"} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.disclaimer, { color: t.textSecondary }]}>Tiruppur AI can make mistakes. Verify important information.</Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
      {/* Company Details Modal */}
      <Modal visible={!!selectedCompany} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setSelectedCompany(null)} />
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
                  <View style={{ position: 'relative', marginRight: 15 }}>
                    <Image
                      source={{ uri: `https://picsum.photos/seed/${selectedCompany?.id}logo/100` }}
                      style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: t.border }}
                    />
                    {selectedCompany?.verified && (
                      <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: t.cardBg, borderRadius: 12, padding: 2 }}>
                        <MaterialIcons name="verified" size={20} color="#3B82F6" />
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: t.textPrimary, flexShrink: 1 }}>{selectedCompany?.name}</Text>
                    </View>
                    <Text style={{ color: t.textSecondary, fontSize: 13 }}>{selectedCompany?.address}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedCompany(null)} style={{ padding: 4, backgroundColor: t.bg, borderRadius: 15, zIndex: 20, marginTop: selectedCompany?.ad ? 28 : 0 }}>
                  <Ionicons name="close" size={24} color={t.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={(e) => { modalScrollY.current = e.nativeEvent.contentOffset.y; }}
              scrollEventThrottle={16}
            >
              {/* Products/Services */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: t.textPrimary, marginBottom: 12 }}>Products & Services</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {selectedCompany?.products?.map((prod: string, i: number) => {
                  const colors = [
                    { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' },
                    { bg: '#F3E8FF', text: '#581C87', border: '#E9D5FF' },
                    { bg: '#FCE7F3', text: '#831843', border: '#FBCFE8' },
                    { bg: '#FFEDD5', text: '#7C2D12', border: '#FED7AA' }
                  ];
                  const c = colors[i % colors.length];
                  return (
                    <View key={i} style={{ backgroundColor: c.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: c.border }}>
                      <Text style={{ color: c.text, fontSize: 14, fontWeight: '500' }}>{prod}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Details List */}
              <View style={{ gap: 15, marginBottom: 24 }}>
                <TouchableOpacity onPress={() => setShowPhoneOptions(selectedCompany?.phone)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: t.bg, borderRadius: 12 }}>
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

              {/* Facility Images */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: t.textPrimary, marginBottom: 12 }}>Facility Overview</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Image key={i} source={{ uri: `https://picsum.photos/seed/${selectedCompany?.id}${i}/200` }} style={{ width: '48%', height: 100, borderRadius: 12, backgroundColor: t.border, flexGrow: 1 }} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Phone Action Sheet Mini Modal */}
      <Modal visible={!!showPhoneOptions} transparent animationType="fade">
        <Pressable onPress={() => setShowPhoneOptions(null)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: t.cardBg, padding: 24, borderRadius: 20, width: '80%', maxWidth: 320 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: t.textPrimary, marginBottom: 20, textAlign: 'center' }}>Contact via</Text>

            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${showPhoneOptions}`); setShowPhoneOptions(null); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: t.bg, borderRadius: 12, marginBottom: 15 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                <Ionicons name="call" size={20} color="#3B82F6" />
              </View>
              <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }}>Dial Pad</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { Linking.openURL(`https://wa.me/${showPhoneOptions?.replace(/[^0-9]/g, '')}`); setShowPhoneOptions(null); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: t.bg, borderRadius: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(37, 211, 102, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              </View>
              <Text style={{ color: t.textPrimary, fontSize: 16, fontWeight: '600' }}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  mobileHeader: { position: 'absolute', top: 0, width: '100%', zIndex: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, paddingTop: Platform.OS === 'web' ? 12 : 40, borderBottomWidth: 1 },
  mobileHeaderTitle: { fontSize: 16, fontWeight: 'bold' },

  chatArea: { padding: 10, paddingBottom: 20 },
  messageBubble: { padding: 12, borderRadius: 16, maxWidth: '92%' },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  aiMessageRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20, gap: 8 },
  aiAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4, maxWidth: '88%' },

  companyCard: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  bottomContainer: { width: '100%', paddingBottom: Platform.OS === 'ios' ? 20 : 10, backgroundColor: 'transparent' },
  chipsRow: { flexDirection: 'row', marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginHorizontal: 10, borderRadius: 30, borderWidth: 1, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  textInput: { flex: 1, minHeight: 36, maxHeight: 120, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 0, textAlignVertical: 'bottom', fontSize: 14, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any },
  actionIconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  disclaimer: { textAlign: 'center', fontSize: 11, marginTop: 10 }
});
