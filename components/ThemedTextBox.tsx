import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TerminalStyles } from '@/constants/AppStyles';
import { Platform } from 'react-native';

export type ThemedTextBoxProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export const ThemedTextBox = forwardRef<TextInput, ThemedTextBoxProps>(
  ({ style, lightColor, darkColor, type = 'default', ...rest }, ref) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
      <TextInput
        ref={ref}
        style={[
          TerminalStyles.text,
          styles.input,
          { color },
          type === 'default' ? styles.default : undefined,
          type === 'title' ? styles.title : undefined,
          type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
          type === 'subtitle' ? styles.subtitle : undefined,
          type === 'link' ? styles.link : undefined,
          style,
          {...Platform.select({
            web: {
              // @ts-ignore: Web-only property
              outline: 'none',
            },
          })},
        ]}

        {...rest}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});