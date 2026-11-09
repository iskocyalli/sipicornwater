import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, rainbow } from '../theme/colors';

type Props = {
  onStart?: () => void;
};

export default function WelcomeScreen({ onStart }: Props) {
  const float = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  const squish = (toValue: number) =>
    Animated.spring(press, { toValue, useNativeDriver: true, speed: 30, bounciness: 12 }).start();

  return (
    <SafeAreaView style={styles.container}>
      {/* soft pastel blobs in the background */}
      <View style={[styles.blob, styles.blobPink]} />
      <View style={[styles.blob, styles.blobMint]} />
      <View style={[styles.blob, styles.blobSky]} />

      <View style={styles.hero}>
        <Animated.View style={[styles.mascotCircle, { transform: [{ translateY }] }]}>
          <Text style={styles.mascot} accessibilityLabel="Sippy the unicorn">
            🦄
          </Text>
        </Animated.View>

        <View style={styles.rainbow}>
          {rainbow.map((c) => (
            <View key={c} style={[styles.rainbowDot, { backgroundColor: c }]} />
          ))}
        </View>

        <Text style={styles.title}>Hi! I'm Sippy</Text>
        <Text style={styles.subtitle}>Every sip makes your unicorn shine. ✨</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: press }] }}>
        <Pressable
          accessibilityRole="button"
          onPressIn={() => squish(0.94)}
          onPressOut={() => squish(1)}
          onPress={onStart}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Let's get started</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.45,
  },
  blobPink: { width: 280, height: 280, backgroundColor: colors.cottonPink, top: -80, left: -90 },
  blobMint: { width: 220, height: 220, backgroundColor: colors.mint, top: 220, right: -110 },
  blobSky: { width: 260, height: 260, backgroundColor: colors.skyBlue, bottom: -100, left: -60 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.plum,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  mascot: {
    fontSize: 110,
  },
  rainbow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
  },
  rainbowDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  title: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: '800',
    color: colors.plum,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '500',
    color: colors.plumSoft,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.cottonPink,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.plum,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.plum,
  },
});
