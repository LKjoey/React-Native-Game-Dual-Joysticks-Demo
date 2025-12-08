import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

/**
 * Character component for game
 *
 * Renders a moveable character on screen. Position is controlled via animated shared values
 * that can be updated from external sources (like a joystick controller).
 *
 * @param x - Animated shared value for x position
 * @param y - Animated shared value for y position
 * @param size - Size of the character (default: 50)
 * @param color - Colour of the character (default: '#FF5555')
 *
 * @example
 * ```tsx
 * const x = useSharedValue(100);
 * const y = useSharedValue(100);
 *
 * <Character x={x} y={y} size={50} color="#FF5555" />
 * ```
 */

interface CharacterProps {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  size?: number;
  color?: string;
}

export const Character: React.FC<CharacterProps> = ({ x, y, size = 50, color = "#FF5555" }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value - size / 2 }, { translateY: y.value - size / 2 }],
  }));

  return (
    <Animated.View
      style={[
        styles.character,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  character: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
