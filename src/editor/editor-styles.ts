import { css } from 'lit';

/** Shared styles for extracted editor panels; legacy styles remain during incremental migration. */
export const extractedPanelStyles = css`
  :host { display: block; }
  .panel-title { min-width: 0; overflow-wrap: anywhere; }
  .custom-item { min-width: 0; overflow-wrap: anywhere; }
  @media (max-width: 480px) {
    :host .form-row { flex-direction: column; align-items: stretch; }
    :host .form-row > select, :host .form-row > input { width: 100%; min-width: 0; box-sizing: border-box; flex: none !important; }
    :host .form-row > label { min-width: 0 !important; overflow-wrap: anywhere; }
  }
`;
