// constants/Colors.ts

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
