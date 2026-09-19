import { color, semantic, font, scale, space, radius, border, hit } from '@common/shared';

const theme = {
  color,
  semantic,
  font,
  fontSize: scale.admin,
  space,
  radius: {
    none: radius.none,
    label: radius.label,
    input: radius.adminInput,
    card: radius.adminCard,
    badge: radius.adminBadge,
    sheet: radius.sheet,
  },
  border,
  hit: {
    min: hit.adminMin,
    input: hit.adminInput,
    button: hit.adminButton,
  },
};

export default theme;
export type AppTheme = typeof theme;
