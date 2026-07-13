import type { LovelaceViewConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';

/** Apply global native view design without overriding custom view-level values. */
export function applyDesign(view: LovelaceViewConfig, config: Simon42StrategyConfig): LovelaceViewConfig {
  const theme = config.theme?.trim();
  const stampTheme = !!theme && !view.theme;
  const stampBackground = !!config.background?.image && !view.background;
  if (!stampTheme && !stampBackground) return view;
  return {
    ...view,
    ...(stampTheme ? { theme } : {}),
    ...(stampBackground ? { background: config.background } : {}),
  };
}
