import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const content = {
  ta: {
    welcome: "Vanakkam Thala! 👋 Naan thaan Tirupur AI. Unga personal smart assistant.",
    opt1_1: "🚀 Nee enna ellam pannuva?",
    opt1_2: "💡 Oru sample kattu",
    bot_reply_enna: "Naan ungaluku business ideas tharuven, code eluthuven, content create panni tharuven! 💻",
    bot_reply_sample: 'Kandipa! "Tirupur la best briyani enga kedaikum?" nu kelunga. Naan udane panni tharuven! ⚡',
    next_step: "Appadiye unga photos kooda kuduthu edit panna sollalam, naan panni tharuven 📸",
    opt2_1: "🔥 Vera level thala!",
    opt2_2: "😍 Super! Chat start pannalama?",
    bot_final: "Pinra thala! Vaanga unga real chat-a start pannalam. Kela iruka button-a amukkunga! 👇",
    start_btn: "Start Real Chat 💬",
    lang_btn: "EN"
  },
  en: {
    welcome: "Hello there! 👋 I am Tirupur AI. Your personal smart assistant.",
    opt1_1: "🚀 What all can you do?",
    opt1_2: "💡 Show me a sample",
    bot_reply_enna: "I can give you business ideas, write code, and create content for you! 💻",
    bot_reply_sample: 'Sure! Ask me "Where is the best biryani in Tirupur?". I will do it instantly! ⚡',
    next_step: "You can even give me photos to edit, and I'll do it for you 📸",
    opt2_1: "🔥 Next level!",
    opt2_2: "😍 Super! Let's start chatting?",
    bot_final: "Awesome! Let's start your real chat. Click the button below! 👇",
    start_btn: "Start Real Chat 💬",
    lang_btn: "TA"
  }
};

export default function IntroScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<'ta'|'en'>('ta');
  const t = content[lang];

  // We will hold messages in an array to map them sequentially
  // types: 'bot' | 'user' | 'typing'
  const [messages, setMessages] = useState<any[]>([]);
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Helper to wait
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    runInitialFlow();
  }, [lang]);

  const runInitialFlow = async () => {
    setMessages([]);
    setShowOptions1(false);
    setShowOptions2(false);
    setShowStartBtn(false);

    setMessages([{ id: 't1', type: 'typing' }]);
    await wait(1500);
    setMessages([{ id: 'm1', type: 'bot', text: t.welcome }]);
    await wait(500);
    setShowOptions1(true);
  };

  const handleOption1 = async (text: string, isEnna: boolean) => {
    setShowOptions1(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
    await wait(500);
    
    setMessages(prev => [...prev, { id: 't2', type: 'typing' }]);
    await wait(1500);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: isEnna ? t.bot_reply_enna : t.bot_reply_sample }]);
    
    await wait(1000);
    setMessages(prev => [...prev, { id: 't3', type: 'typing' }]);
    await wait(1500);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: t.next_step }]);
    
    await wait(500);
    setShowOptions2(true);
  };

  const handleOption2 = async (text: string) => {
    setShowOptions2(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
    await wait(500);
    
    setMessages(prev => [...prev, { id: 't4', type: 'typing' }]);
    await wait(1500);
    
    setMessages(prev => prev.filter(m => m.type !== 'typing'));
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: t.bot_final }]);
    
    await wait(800);
    setShowStartBtn(true);
  };

  const toggleLang = () => {
    setLang(lang === 'ta' ? 'en' : 'ta');
  };

  const handleStart = () => {
    router.replace('/chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Tirupur AI ✨</Text>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLang}>
          <Text style={styles.langBtnText}>{t.lang_btn}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={{ paddingBottom: 40 }}
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

      {showOptions1 && (
        <View style={styles.chipsContainer}>
          <TouchableOpacity style={styles.chip} onPress={() => handleOption1(t.opt1_1, true)}>
            <Text style={styles.chipText}>{t.opt1_1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleOption1(t.opt1_2, false)}>
            <Text style={styles.chipText}>{t.opt1_2}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showOptions2 && (
        <View style={styles.chipsContainer}>
          <TouchableOpacity style={styles.chip} onPress={() => handleOption2(t.opt2_1)}>
            <Text style={styles.chipText}>{t.opt2_1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleOption2(t.opt2_2)}>
            <Text style={styles.chipText}>{t.opt2_2}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showStartBtn && (
        <View style={styles.chipsContainer}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>{t.start_btn}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const AnimatedMessage = ({ isBot, text }: { isBot: boolean, text: string }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.message, isBot ? styles.botMessage : styles.userMessage, { opacity, transform: [{ translateY }] }]}>
      <Text style={isBot ? styles.messageText : styles.userMessageText}>{text}</Text>
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
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1b4b', // Deep indigo/violet background
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#312e81',
    backgroundColor: 'rgba(30, 27, 75, 0.95)',
  },
  headerText: {
    color: '#e0e7ff',
    fontSize: 22,
    fontWeight: '800',
  },
  langBtn: {
    backgroundColor: '#4338ca',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  langBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  message: {
    maxWidth: '82%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botMessage: {
    backgroundColor: '#312e81', // Indigo bot bubble
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#6366f1', // Vibrant indigo user bubble
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: '#e0e7ff',
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  chipsContainer: {
    padding: 20,
    paddingBottom: 30,
    gap: 12,
    backgroundColor: '#1e1b4b',
    borderTopWidth: 1,
    borderTopColor: '#312e81',
  },
  chip: {
    backgroundColor: '#312e81',
    borderWidth: 1,
    borderColor: '#4338ca',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  chipText: {
    color: '#e0e7ff',
    fontSize: 16,
    fontWeight: '500',
  },
  startBtn: {
    backgroundColor: '#8b5cf6', // Violet accent
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  startBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  typingContainer: {
    flexDirection: 'row',
    backgroundColor: '#312e81',
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a5b4fc',
    marginHorizontal: 3,
  }
});
