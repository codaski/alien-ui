/**
 * Alien UI — Theme token types.
 *
 * Describes the shape of the theme configuration object passed to createAlienUI().
 * All values map to --alien-* CSS custom properties.
 */

export interface AlienThemeTokens {
  // ── Colours (HSL channel strings, e.g. "210 100% 56%") ─────────────────
  primary?:             string
  primaryForeground?:   string
  secondary?:           string
  secondaryForeground?: string
  surface?:             string
  surfaceElevated?:     string
  border?:              string
  foreground?:          string
  muted?:               string
  mutedForeground?:     string
  destructive?:         string
  destructiveForeground?: string
  success?:             string
  successForeground?:   string
  warning?:             string
  warningForeground?:   string

  // ── Shape ─────────────────────────────────────────────────────────────
  radius?:   string   // e.g. "0.5rem"
  radiusSm?: string
  radiusLg?: string
  radiusXl?: string

  // ── Typography ─────────────────────────────────────────────────────────
  fontSans?: string
  fontMono?: string
}

export interface AlienThemeConfig {
  /** Light mode token overrides */
  light?: AlienThemeTokens
  /** Dark mode token overrides */
  dark?:  AlienThemeTokens
}
