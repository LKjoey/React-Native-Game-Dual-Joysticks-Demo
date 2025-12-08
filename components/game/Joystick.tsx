import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/**
 * Joystick component for game controls
 *
 * Provides a virtual joystick interface that reports directional input.
 * The joystick consists of a base and a stick that can be dragged within the base.
 *
 * @param onMove - Callback function that receives normalised x and y values (-1 to 1)
 * @param size - Diameter of the joystick base (default: 150)
 * @param stickSize - Diameter of the draggable stick (default: 60)
 * @param baseColor - Colour of the joystick base (default: 'rgba(0, 0, 0, 0.3)')
 * @param stickColor - Colour of the joystick stick (default: 'rgba(0, 0, 0, 0.6)')
 *
 * @example
 * ```tsx
 * <Joystick
 *   onMove={(x, y) => console.log('Joystick moved:', x, y)}
 *   size={150}
 *   stickSize={60}
 * />
 * ```
 */

interface JoystickProps {
  onMove?: (x: number, y: number) => void;
  size?: number;
  stickSize?: number;
  baseColor?: string;
  stickColor?: string;
}

export const Joystick: React.FC<JoystickProps> = ({
  onMove,
  size = 150,
  stickSize = 60,
  baseColor = "rgba(0, 0, 0, 0.3)",
  stickColor = "rgba(0, 0, 0, 0.6)",
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const maxDistance = (size - stickSize) / 2;

  const reportMove = (x: number, y: number) => {
    "worklet";
    if (onMove) {
      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;
      scheduleOnRN(onMove, normalizedX, normalizedY);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);

      if (distance <= maxDistance) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else {
        // Constrain to circle boundary
        const angle = Math.atan2(event.translationY, event.translationX);
        translateX.value = Math.cos(angle) * maxDistance;
        translateY.value = Math.sin(angle) * maxDistance;
      }

      reportMove(translateX.value, translateY.value);
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      reportMove(0, 0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: baseColor,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.stick,
            {
              width: stickSize,
              height: stickSize,
              borderRadius: stickSize / 2,
              backgroundColor: stickColor,
            },
            animatedStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
  },
  stick: {
    position: "absolute",
  },
});
