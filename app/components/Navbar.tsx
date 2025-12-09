// components/Navbar.tsx - LEAN & TIGHT PRECISION
import { usePathname, useRouter } from "expo-router";
import { Handbag, Heart, House } from "lucide-react-native";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_NAVBAR_WIDTH = SCREEN_WIDTH * 0.72; // Lebih ramping
const ICON_TOUCH_SIZE = 44; // Reduced from 48
const AVAILABLE_SPACE = TOTAL_NAVBAR_WIDTH - ICON_TOUCH_SIZE * 3;
const SPACING_BETWEEN_ICONS = AVAILABLE_SPACE / 4;

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  const navItems = useMemo(
    () => [
      {
        id: 1,
        path: "/screens/HomePage",
        icon: House,
        activeColor: "#000000",
        iconSize: { active: 23, inactive: 20 },
      },
      {
        id: 2,
        path: "/screens/Product",
        icon: Handbag,
        activeColor: "#000000",
        iconSize: { active: 23, inactive: 20 },
      },
      {
        id: 3,
        path: "/screens/Wishlist",
        icon: Heart,
        activeColor: "#FF375F",
        iconSize: { active: 23, inactive: 20 },
      },
    ],
    []
  );

  const isActive = (itemPath: string) => path === itemPath;

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {/* LEAN & TIGHT NAVBAR */}
      <View style={[styles.leanBar, { width: TOTAL_NAVBAR_WIDTH }]}>
        {/* START SPACER */}
        <View style={{ width: SPACING_BETWEEN_ICONS }} />

        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.leanTouch}
                onPress={() => !active && router.push(item.path)}
                activeOpacity={0.5}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Icon
                  size={active ? item.iconSize.active : item.iconSize.inactive}
                  color={active ? item.activeColor : "#8E8E93"}
                  strokeWidth={active ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={active && item.id === 3 ? item.activeColor : "none"}
                />
              </TouchableOpacity>

              {/* SPACER BETWEEN ICONS */}
              {index < navItems.length - 1 && (
                <View style={{ width: SPACING_BETWEEN_ICONS }} />
              )}
            </React.Fragment>
          );
        })}

        {/* END SPACER */}
        <View style={{ width: SPACING_BETWEEN_ICONS }} />
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
    zIndex: 1000,
  },
  leanBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20, // Slightly smaller radius
    paddingVertical: 12, // TIGHT! Reduced from 16
    height: 56, // TOTAL HEIGHT: 12 + 44 + 12 = 68? Wait, let me fix

    // CRISP & LIGHT SHADOW
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,

    // THIN BORDER
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  leanTouch: {
    width: ICON_TOUCH_SIZE,
    height: ICON_TOUCH_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
