import { usePathname, useRouter } from "expo-router";
import { Handbag, Heart, House, SprayCan } from "lucide-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// NAVBAR WIDTH 85% dari layar
const NAVBAR_WIDTH_PCT = 0.85;

type NavItem = {
  id: number;
  path: string;
  icon: React.ComponentType<any>;
  activeColor: string;
  inactiveColor: string;
};

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: 1,
        path: "/screens/HomePage",
        icon: House,
        activeColor: "#000000",
        inactiveColor: "#8E8E93",
      },
      {
        id: 2,
        path: "/screens/FindScent",
        icon: SprayCan,
        activeColor: "#000000",
        inactiveColor: "#8E8E93",
      },
      {
        id: 3,
        path: "/screens/Product",
        icon: Handbag,
        activeColor: "#000000",
        inactiveColor: "#8E8E93",
      },
      {
        id: 4,
        path: "/screens/Wishlist",
        icon: Heart,
        activeColor: "#FF375F",
        inactiveColor: "#8E8E93",
      },
    ],
    []
  );

  const isActive = (itemPath: string) => path === itemPath;

  // Animations refs
  const scaleAnimations = useRef(
    navItems.map(() => new Animated.Value(1))
  ).current;

  const translateAnimations = useRef(
    navItems.map(() => new Animated.Value(0))
  ).current;

  const handlePress = (itemPath: string) => {
    if (isActive(itemPath)) return;

    // Reset animasli semua icon sebelum pindah
    navItems.forEach((_, i) => {
      Animated.parallel([
        Animated.spring(scaleAnimations[i], {
          toValue: 1,
          tension: 180,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnimations[i], {
          toValue: 0,
          tension: 180,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // REVISI: Pakai replace biar sinkron sama animasi slide per page
    router.replace(itemPath as any);
  };

  useEffect(() => {
    navItems.forEach((item, index) => {
      const active = isActive(item.path);

      Animated.parallel([
        Animated.spring(scaleAnimations[index], {
          toValue: active ? 1.08 : 1,
          tension: 200,
          friction: 16,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnimations[index], {
          toValue: active ? -3 : 0,
          tension: 200,
          friction: 17,
          useNativeDriver: true,
        }),
      ]).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, navItems]);

  // HITUNG SPACING DINAMIS
  const totalNavWidth = SCREEN_WIDTH * NAVBAR_WIDTH_PCT;
  const iconSize = 44;
  const availableSpace = totalNavWidth - iconSize * navItems.length;
  const spacingBetweenIcons = availableSpace / (navItems.length + 1);

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={[styles.bar, { width: totalNavWidth }]}>
        <View style={{ width: spacingBetweenIcons }} />

        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.touch}
                onPress={() => handlePress(item.path)}
                activeOpacity={0.6}
              >
                <Animated.View
                  style={{
                    transform: [
                      { scale: scaleAnimations[index] },
                      { translateY: translateAnimations[index] },
                    ],
                  }}
                >
                  <Icon
                    size={active ? 26 : 22}
                    color={active ? item.activeColor : item.inactiveColor}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </Animated.View>
              </TouchableOpacity>

              {index < navItems.length - 1 && (
                <View style={{ width: spacingBetweenIcons }} />
              )}
            </React.Fragment>
          );
        })}

        <View style={{ width: spacingBetweenIcons }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    height: 62, // Sedikit lebih tinggi biar icon nafas

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  touch: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
