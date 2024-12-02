// constants/Colors.ts

import { Platform } from 'react-native';

const terminalGreen = '#00FF00';
const dimTerminalGreen = '#00B800';
const terminalBackground = '#001100';
const terminalBlack = '#000800';

export const Colors = {
  light: {
    text: terminalGreen,
    background: terminalBlack,
    tint: terminalGreen,
    icon: dimTerminalGreen,
    tabIconDefault: dimTerminalGreen,
    tabIconSelected: terminalGreen,
    // Terminal specific colors
    terminal: {
      cursor: terminalGreen,
      selection: '#003300',
      highlight: '#004400',
      border: dimTerminalGreen,
    }
  },
  dark: {
    // We'll use the same colors for both themes to maintain the terminal look
    text: terminalGreen,
    background: terminalBlack,
    tint: terminalGreen,
    icon: dimTerminalGreen,
    tabIconDefault: dimTerminalGreen,
    tabIconSelected: terminalGreen,
    terminal: {
      cursor: terminalGreen,
      selection: '#003300',
      highlight: '#004400',
      border: dimTerminalGreen,
    }
  },
};

// Add terminal-specific styles
export const TerminalStyles = {
  text: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'Courier New'
    }),
    letterSpacing: 0.5,
  },
  container: {
    shadowColor: terminalGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  scanline: {
    opacity: 0.3,
    backgroundColor: terminalGreen,
  }
};