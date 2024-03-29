import { extendTheme } from '@chakra-ui/react';
import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'blackAlpha.200',
  },
  dialog: {
    top: '19%',
    borderRadius: 'md',
    width: '80%',
    height: '60%',
  },
  body: {
    height: '100%',
    overflowY: 'scroll',
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});

const theme = extendTheme({
  fonts: {
    body: '맑은 고딕, Malgun Gothic, sans-serif',
    heading: '맑은 고딕, Malgun Gothic, sans-serif',
  },
  components: {
    Modal: modalTheme,
  },
});

export default theme;
