import { Platform } from 'react-native';

export const TerminalStyles = {
    text: {
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
        default: 'Courier New'
      }),
      letterSpacing: 0.7, // Increased letter spacing
      textShadow: Platform.select({
        web: `
          0.4px 0.4px 0 #00FF00,
          -0.4px -0.4px 0 #00FF00,
          0px 0.4px 0 #00FF00,
          0 -0.4px 0 #00FF00
        `,
        default: undefined
      }),
      // For native platforms, we'll use multiple text shadow properties
      ...Platform.select({
        ios: {
          textShadowColor: '#00FF00',
          textShadowOffset: { width: 0.4, height: 0.4 },
          textShadowRadius: 0.4,
        },
        android: {
          textShadowColor: '#00FF00',
          textShadowOffset: { width: 0.4, height: 0.4 },
          textShadowRadius: 0.4,
        },
        default: {}
      })
    },
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
};