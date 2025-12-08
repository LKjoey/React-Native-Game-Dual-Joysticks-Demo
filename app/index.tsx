import React, { useCallback } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useSharedValue, useFrameCallback} from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { Joystick } from "@/components/game/Joystick";

const { width, height } = Dimensions.get("window");
const BALL_SIZE = 50;
const MOVE_SPEED = 5;

export default function GameScreen() {
  // The small red ball (left)
  const redBallX = useSharedValue(width / 4);     // Initially on the left
  const redBallY = useSharedValue(height / 2);
  const leftJoystickX = useSharedValue(0);
  const leftJoystickY = useSharedValue(0);

  // The small blue ball (right)
  const blueBallX = useSharedValue((3 * width) / 4);  // Initially on the right
  const blueBallY = useSharedValue(height / 2);
  const rightJoystickX = useSharedValue(0);
  const rightJoystickY = useSharedValue(0);

  // Frame loop: Update the positions of the two small balls
  useFrameCallback(() => {
    // Update the red ball
    if (leftJoystickX.value !== 0 || leftJoystickY.value !== 0) {
      const newX = redBallX.value + leftJoystickX.value * MOVE_SPEED;
      const newY = redBallY.value + leftJoystickY.value * MOVE_SPEED;

      const minX = BALL_SIZE / 2;
      const maxX = width - BALL_SIZE / 2;
      const minY = BALL_SIZE / 2;
      const maxY = height - BALL_SIZE / 2;

      redBallX.value = Math.max(minX, Math.min(maxX, newX));
      redBallY.value = Math.max(minY, Math.min(maxY, newY));
    }

    //  Update the blue ball
    if (rightJoystickX.value !== 0 || rightJoystickY.value !== 0) {
      const newX = blueBallX.value + rightJoystickX.value * MOVE_SPEED;
      const newY = blueBallY.value + rightJoystickY.value * MOVE_SPEED;

      const minX = BALL_SIZE / 2;
      const maxX = width - BALL_SIZE / 2;
      const minY = BALL_SIZE / 2;
      const maxY = height - BALL_SIZE / 2;

      blueBallX.value = Math.max(minX, Math.min(maxX, newX));
      blueBallY.value = Math.max(minY, Math.min(maxY, newY));
    }
  });

  // Joystick callback
  const handleLeftJoystickMove = useCallback((x: number, y: number) => {
    leftJoystickX.value = x;
    leftJoystickY.value = y;
  }, []);

  const handleRightJoystickMove = useCallback((x: number, y: number) => {
    rightJoystickX.value = x;
    rightJoystickY.value = y;
  }, []);
  

  return (
    <View style={styles.container}>
      {/* red ball */}
      <AnimatedBall x={redBallX} y={redBallY} color="#FF5555" />

      {/* blue ball */}
      <AnimatedBall x={blueBallX} y={blueBallY} color="#5555FF" />

      {/* Left joystick - Independent RootView */}
      <GestureHandlerRootView style={styles.leftControls}>
        <Joystick
          onMove={handleLeftJoystickMove}
          size={160}
          stickSize={60}
          baseColor="rgba(100, 100, 100, 0.3)"
          stickColor="rgba(50, 50, 50, 0.7)"
        />
      </GestureHandlerRootView>

      {/* Right joystick - Independent RootView */}
      <GestureHandlerRootView style={styles.rightControls}>
        <Joystick
          onMove={handleRightJoystickMove}
          size={160}
          stickSize={60}
          baseColor="rgba(100, 100, 100, 0.3)"
          stickColor="rgba(50, 50, 50, 0.7)"
        />
      </GestureHandlerRootView>
    </View>
  );
}

const AnimatedBall: React.FC<{
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  color: string;
}> = ({ x, y, color }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value - BALL_SIZE / 2 }, { translateY: y.value - BALL_SIZE / 2 }],
  }));

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          width: BALL_SIZE,
          height: BALL_SIZE,
          backgroundColor: color,
          borderRadius: BALL_SIZE / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    position: "relative",   
  },
  ball: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  leftControls: {
    position: "absolute",
    bottom: 80,
    left: 20,
  },
  rightControls: {
    position: "absolute",
    bottom: 80,
    right: 20,
  },
});