import { usePathname, useRouter } from "expo-router";
import { Handbag, Heart, House } from "lucide-react-native";
import React, { useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
        path: "/screens/Product",
        icon: Handbag,
        activeColor: "#000000",
        inactiveColor: "#8E8E93",
      },
      {
        id: 3,
        path: "/screens/Wishlist",
        icon: Heart,
        activeColor: "#FF375F",
        inactiveColor: "#8E8E93",
      },
    ],
    []
  );

  const isActive = (itemPath: string) => path === itemPath;

  // Animations
  const scaleAnimations = useRef(
    navItems.map(() => new Animated.Value(1))
  ).current;

  const translateAnimations = useRef(
    navItems.map(() => new Animated.Value(0))
  ).current;

  const handlePress = (itemPath: string) => {
    if (isActive(itemPath)) return;

    // reset anim
    navItems.forEach((_, i) => {
      Animated.spring(scaleAnimations[i], {
        toValue: 1,
        tension: 180,
        friction: 12,
        useNativeDriver: true,
      }).start();

      Animated.spring(translateAnimations[i], {
        toValue: 0,
        tension: 180,
        friction: 12,
        useNativeDriver: true,
      }).start();
    });

    router.push(itemPath);
  };

  React.useEffect(() => {
    navItems.forEach((item, index) => {
      const active = isActive(item.path);

      Animated.spring(scaleAnimations[index], {
        toValue: active ? 1.04 : 1,
        tension: 200,
        friction: 16,
        useNativeDriver: true,
      }).start();

      Animated.spring(translateAnimations[index], {
        toValue: active ? -2 : 0,
        tension: 200,
        friction: 17,
        useNativeDriver: true,
      }).start();
    });
  }, [path]);

  const availableSpace = SCREEN_WIDTH * 0.72 - 44 * 3;
  const spacingBetweenIcons = availableSpace / 4;

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={[styles.bar, { width: SCREEN_WIDTH * 0.72 }]}>
        <View style={{ width: spacingBetweenIcons }} />

        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          const scaleAnim = scaleAnimations[index];
          const translateAnim = translateAnimations[index];

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
                      { scale: scaleAnim },
                      { translateY: translateAnim },
                    ],
                  }}
                >
                  <Icon
                    size={active ? 27 : 23}
                    color={active ? item.activeColor : item.inactiveColor}
                    strokeWidth={active ? 2.5 : 1.8}
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
    borderRadius: 20,
    paddingVertical: 14,
    height: 58,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,

    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  touch: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
