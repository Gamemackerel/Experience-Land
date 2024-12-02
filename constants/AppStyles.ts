import { Platform } from 'react-native';

export const TerminalStyles = {
    text: {
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
        default: 'Courier New'
      }),
      letterSpacing: 0.5,
    },
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
};