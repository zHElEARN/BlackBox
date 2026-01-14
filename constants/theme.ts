/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const BrandBlue = "#5E97D1";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    card: "#F5F5F7",
    tint: BrandBlue,
    icon: "#8E8E93",
    tabIconDefault: "#8E8E93",
    tabIconSelected: BrandBlue,
    border: "#E5E5E7",
  },
  dark: {
    text: "#F2F2F7",
    background: "#0B0B0B",
    card: "#1C1C1E",
    tint: BrandBlue,
    icon: "#8E8E93",
    tabIconDefault: "#8E8E93",
    tabIconSelected: BrandBlue,
    border: "#2C2C2E",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
