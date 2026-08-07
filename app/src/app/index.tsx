import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, StatusBar, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const translations = {
  TA: {
    welcome: "திருப்பூர் AI-க்கு வரவேற்கிறோம்",
    tourLang: "உங்கள் மொழியை இங்கே மாற்றலாம்",
    tourAboutTitle: "திருப்பூர் AI என்றால் என்ன?",
    tourAboutDesc: "திருப்பூர் ஜவுளித் தொழிலின் அனைத்து தேவைகளுக்கும் ஒரே தீர்வு! சிறந்த நிறுவனங்கள், உற்பத்தியாளர்கள் மற்றும் வேலைகளை எளிதாகக் கண்டறியலாம்.",
    nextBtn: "அடுத்து",
    startChatTourBtn: "எப்படி தேடுவது என்று பார்ப்போம்",
    chatWelcome: "வணக்கம்! நான் திருப்பூர் AI. உங்கள் உதவியாளர்.",
    opt1: "நீங்கள் என்ன செய்வீர்கள்?",
    opt2: "ஒரு உதாரணம் காட்டு",
    bot_reply_enna: "நான் சிறந்த வணிக தொடர்புகளைத் தருவேன், மேலும் திருப்பூர் பற்றிய எந்தக் கேள்விக்கும் பதிலளிப்பேன்.",
    bot_reply_sample: 'கண்டிப்பாக! "திருப்பூரில் சிறந்த ஸ்பின்னிங் மில் எங்கே உள்ளது?" என்று கேளுங்கள், நான் உடனே தகவல் தருகிறேன்.',
    next_step: "உங்கள் குரலிலும் நீங்கள் தமிழில் தேடலாம்.",
    opt2_1: "அற்புதம்",
    opt2_2: "தேடலைத் தொடங்குவோம்",
    bot_final: "உண்மையான தேடலைத் தொடங்க கீழே உள்ள பொத்தானை அழுத்தவும்.",
    start_btn: "தேடலைத் தொடங்கு"
  },
  EN: {
    welcome: "Welcome to Tiruppur AI",
    tourLang: "You can change your language here",
    tourAboutTitle: "What is Tiruppur AI?",
    tourAboutDesc: "The one-stop solution for Tiruppur's textile industry! Easily find the best companies, manufacturers, and contacts.",
    nextBtn: "Next",
    startChatTourBtn: "See how it works",
    chatWelcome: "Hello! I am Tiruppur AI. Your personal smart assistant.",
    opt1: "What can you do?",
    opt2: "Show me a sample",
    bot_reply_enna: "I can give you the best business contacts and answer any questions about Tiruppur.",
    bot_reply_sample: 'Sure! Ask me "Where is the best spinning mill in Tiruppur?", and I will give you the info instantly.',
    next_step: "You can even search using your voice.",
    opt2_1: "Awesome",
    opt2_2: "Let's start searching",
    bot_final: "Click the button below to start your real chat.",
    start_btn: "Start Real Chat"
  },
  HI: {
    welcome: "तिरुपुर AI में आपका स्वागत है",
    tourLang: "आप यहां अपनी भाषा बदल सकते हैं",
    tourAboutTitle: "तिरुपुर AI क्या है?",
    tourAboutDesc: "तिरुपुर के कपड़ा उद्योग के लिए वन-स्टॉप समाधान! आसानी से सर्वोत्तम कंपनियों और निर्माताओं को खोजें।",
    nextBtn: "अगला",
    startChatTourBtn: "देखें यह कैसे काम करता है",
    chatWelcome: "नमस्ते! मैं तिरुपुर AI हूँ। आपका निजी सहायक।",
    opt1: "आप क्या कर सकते हैं?",
    opt2: "मुझे एक उदाहरण दिखाएं",
    bot_reply_enna: "मैं आपको सर्वोत्तम व्यावसायिक संपर्क दे सकता हूँ और तिरुपुर के बारे में उत्तर दे सकता हूँ।",
    bot_reply_sample: 'ज़रूर! मुझसे पूछें "तिरुपुर में सबसे अच्छी कताई मिल कहाँ है?", मैं तुरंत जानकारी दूँगा।',
    next_step: "आप अपनी आवाज़ का उपयोग करके भी खोज सकते हैं।",
    opt2_1: "बहुत बढ़िया",
    opt2_2: "खोज शुरू करें",
    bot_final: "अपनी वास्तविक चैट शुरू करने के लिए नीचे दिए गए बटन पर क्लिक करें।",
    start_btn: "चैट शुरू करें"
  },
  TG: {
    welcome: "Tiruppur AI ku Welcome",
    tourLang: "Unga language ah inga mathikalam",
    tourAboutTitle: "Tiruppur AI na enna?",
    tourAboutDesc: "Tiruppur textile industry oda all-in-one solution! Best companies, manufacturers ah easy ah thedalam.",
    nextBtn: "Next",
    startChatTourBtn: "Eppadi work aaguthu nu paapom",
    chatWelcome: "Vanakkam! Naan thaan Tiruppur AI. Unga assistant.",
    opt1: "Nee enna ellam pannuva?",
    opt2: "Oru sample kattu",
    bot_reply_enna: "Naan best business contacts tharuven, Tiruppur pathi entha kelvi kettalum answer pannuven.",
    bot_reply_sample: 'Kandipa! "Tiruppur la best spinning mill enga irukku?" nu kelunga, udane details tharuven.',
    next_step: "Unga voice use panni kooda thedalam.",
    opt2_1: "Super",
    opt2_2: "Search start pannalam",
    bot_final: "Real chat start panna keela irukka button ah press pannunga.",
    start_btn: "Start Real Chat"
  }
};

const LANGUAGES = ['TA', 'EN', 'TG', 'HI'] as const;
type LangType = typeof LANGUAGES[number];

const THEME = {
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#4B5563',
  accent: '#14532D', // Forest Green
  border: '#E2E8F0',
  botBubble: '#F1F5F9',
  userBubble: '#14532D',
};

export default function IntroScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<LangType>('TA');
  const t = translations[lang];

  // 0: Welcome, 1: Lang Tour, 2: About, 3: Chat Sim
  const [tourStep, setTourStep] = useState(0);

  // Chat Sim State
  const [messages, setMessages] = useState<any[]>([]);
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bgScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade in for Welcome
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // Pulse for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Slow breathing animation for background (Ken Burns style)
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgScaleAnim, { toValue: 1.15, duration: 15000, useNativeDriver: true }),
        Animated.timing(bgScaleAnim, { toValue: 1, duration: 15000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleNextTourStep = () => {
    if (tourStep === 0) {
      setTourStep(1);
    } else if (tourStep === 1) {
      setTourStep(2);
    } else if (tourStep === 2) {
      setTourStep(3);
      runChatSim();
    }
  };

  const getBackgroundImage = () => {
    switch (tourStep) {
      case 0: return require('../../assets/images/tiruppur_map.png');
      case 1: return require('../../assets/images/knitting_machines.png');
      case 2: return require('../../assets/images/clothes.png');
      case 3: return require('../../assets/images/dyeing.png');
      default: return require('../../assets/images/tiruppur_map.png');
    }
  };

  const runChatSim = async () => {
    setMessages([{ id: 'm1', type: 'bot', text: t.chatWelcome }]);
    await wait(600);
    setShowOptions1(true);
  };

  const handleOption1 = async (text: string, isEnna: boolean) => {
    setShowOptions1(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
    await wait(400);
    
    setMessages(prev => [...prev, { id: 't2', type: 'typing' }]);
    await wait(800);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: isEnna ? t.bot_reply_enna : t.bot_reply_sample }]);
    
    await wait(600);
    setMessages(prev => [...prev, { id: 't3', type: 'typing' }]);
    await wait(800);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: t.next_step }]);
    
    await wait(400);
    setShowOptions2(true);
  };

  const handleOption2 = async (text: string) => {
    setShowOptions2(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
    await wait(400);
    
    setMessages(prev => [...prev, { id: 't4', type: 'typing' }]);
    await wait(800);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: t.bot_final }]);
    
    await wait(500);
    setShowStartBtn(true);
  };

  const selectLanguage = (selectedLang: LangType) => {
    setLang(selectedLang);
    setShowLangDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <Animated.Image 
        source={getBackgroundImage()} 
        style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%', transform: [{ scale: bgScaleAnim }] }]}
        resizeMode="cover"
        blurRadius={3}
      />
      <View style={styles.bgOverlay} />

      {/* Full Screen Overlay for Step 1 */}
      {tourStep === 1 && (
        <View style={styles.overlay} pointerEvents="none" />
      )}

      {/* Header - Always visible, but raised z-index for tour */}
      <View style={[styles.header, tourStep === 1 && { zIndex: 100 }]}>
        <View style={styles.headerLogoContainer}>
          <Ionicons name="hardware-chip" size={24} color={THEME.accent} style={{ marginRight: 8 }} />
          <Text style={styles.headerText}>Tiruppur AI</Text>
        </View>
        <View style={{ position: 'relative', zIndex: 100 }}>
          <TouchableOpacity 
            style={[styles.langBtn, tourStep === 1 && styles.langBtnHighlight]} 
            onPress={() => setShowLangDropdown(!showLangDropdown)}
          >
            <Ionicons name="language" size={16} color={THEME.accent} style={{ marginRight: 6 }} />
            <Text style={styles.langBtnText}>{lang}</Text>
            <Ionicons name="chevron-down" size={14} color={THEME.accent} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {showLangDropdown && (
            <View style={styles.dropdownMenu}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity 
                  key={l} 
                  style={[styles.dropdownItem, lang === l && styles.dropdownItemSelected]} 
                  onPress={() => selectLanguage(l)}
                >
                  <Text style={[styles.dropdownItemText, lang === l && { fontWeight: 'bold', color: THEME.accent }]}>
                    {l === 'TA' ? 'Tamil' : l === 'EN' ? 'English' : l === 'HI' ? 'Hindi' : 'Tanglish'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Tour Step 1: Tooltip */}
      {tourStep === 1 && (
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltipArrow} />
          <View style={styles.tooltipBox}>
            <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.tooltipText}>{t.tourLang}</Text>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Step 0: Welcome */}
        {tourStep === 0 && (
          <View style={styles.centerBox}>
            <Ionicons name="sparkles" size={48} color={THEME.accent} style={{ marginBottom: 20 }} />
            <Text style={styles.welcomeText}>{t.welcome}</Text>
          </View>
        )}

        {/* Step 1 & 2: About / Wait */}
        {(tourStep === 1 || tourStep === 2) && (
          <View style={[styles.centerBox, { zIndex: 10 }]}>
            {tourStep === 2 && (
              <View style={styles.aboutCard}>
                <View style={styles.aboutIconWrapper}>
                  <Ionicons name="business" size={32} color={THEME.accent} />
                </View>
                <Text style={styles.aboutTitle}>{t.tourAboutTitle}</Text>
                <Text style={styles.aboutDesc}>{t.tourAboutDesc}</Text>
              </View>
            )}
          </View>
        )}

        {/* Step 3: Chat Sim */}
        {tourStep === 3 && (
          <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatArea} 
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => {
                if (msg.type === 'typing') {
                  return <TypingIndicator key={msg.id} />;
                }
                const isBot = msg.type === 'bot';
                return (
                  <AnimatedMessage key={msg.id} isBot={isBot} text={msg.text} />
                );
              })}
            </ScrollView>

            <View style={styles.chipsWrapper}>
              {showOptions1 && (
                <View style={styles.chipsContainer}>
                  <InteractiveChip text={t.opt1_1} icon="flash-outline" onPress={() => handleOption1(t.opt1_1, true)} />
                  <InteractiveChip text={t.opt1_2} icon="bulb-outline" onPress={() => handleOption1(t.opt1_2, false)} />
                </View>
              )}

              {showOptions2 && (
                <View style={styles.chipsContainer}>
                  <InteractiveChip text={t.opt2_1} icon="flame-outline" onPress={() => handleOption2(t.opt2_1)} />
                  <InteractiveChip text={t.opt2_2} icon="chatbubbles-outline" onPress={() => handleOption2(t.opt2_2)} />
                </View>
              )}

              {showStartBtn && (
                <Pressable onPress={() => router.replace('/chat')}>
                  <Animated.View style={[styles.startBtn, { transform: [{ scale: pulseAnim }] }]}>
                    <Text style={styles.startBtnText}>{t.start_btn}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </Animated.View>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Tour Next Button Footer (for steps 0,1,2) */}
      {tourStep < 3 && (
        <View style={[styles.footer, { zIndex: tourStep === 1 ? 100 : 10 }]}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNextTourStep}>
            <Text style={styles.nextBtnText}>{tourStep === 2 ? t.startChatTourBtn : t.nextBtn}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}


    </SafeAreaView>
  );
}

// Reusable Components
const InteractiveChip = ({ text, icon, onPress }: { text: string, icon: any, onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      <Animated.View style={[styles.chip, { transform: [{ scale }] }]}>
        <Ionicons name={icon} size={18} color={THEME.accent} style={{ marginRight: 8 }} />
        <Text style={styles.chipText}>{text}</Text>
      </Animated.View>
    </Pressable>
  );
};

const AnimatedMessage = ({ isBot, text }: { isBot: boolean, text: string }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.message, 
      isBot ? styles.botMessage : styles.userMessage, 
      { opacity, transform: [{ translateY }] }
    ]}>
      {isBot && (
        <View style={styles.botAvatar}>
          <Ionicons name="hardware-chip" size={16} color={THEME.accent} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={isBot ? styles.messageText : styles.userMessageText}>{text}</Text>
      </View>
    </Animated.View>
  );
};

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      );
    };
    animateDot(dot1, 0).start();
    animateDot(dot2, 200).start();
    animateDot(dot3, 400).start();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.botAvatarSmall}>
        <Ionicons name="hardware-chip" size={12} color={THEME.accent} />
      </View>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 250, 252, 0.88)', // Light frosted glass overlay to make text readable
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // for android status bar if translucent
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  langBtnHighlight: {
    backgroundColor: '#FFFFFF',
    borderColor: THEME.accent,
    borderWidth: 2,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  langBtnText: {
    color: THEME.accent,
    fontWeight: 'bold',
    fontSize: 13,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemSelected: {
    backgroundColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: THEME.textPrimary,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 100,
    alignItems: 'flex-end',
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: THEME.accent,
    marginRight: 15,
  },
  tooltipBox: {
    backgroundColor: THEME.accent,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.textPrimary,
    textAlign: 'center',
    lineHeight: 42,
  },
  aboutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  aboutIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  aboutDesc: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  nextBtn: {
    backgroundColor: THEME.accent,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
    padding: 16,
  },
  message: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  botMessage: {
    backgroundColor: THEME.botBubble,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  userMessage: {
    backgroundColor: THEME.userBubble,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: THEME.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  botAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  typingContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.botBubble,
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.textSecondary,
    marginHorizontal: 3,
  },
  chipsWrapper: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: THEME.accent,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
