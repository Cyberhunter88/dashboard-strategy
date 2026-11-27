import { html, nothing, type TemplateResult } from 'lit';

/**
 * Home Assistant 2026.4 replaced `ha-textfield` with `ha-input`, and 2026.11 no
 * longer ships `ha-textfield` at all: an unknown element renders nothing, so the
 * editor's free-text fields disappeared. Render `ha-input` whenever the running
 * frontend defines it and keep `ha-textfield` for older Home Assistant versions.
 */
export interface TextInputOptions {
  label: string;
  value: string;
  /** Helper text below the field (`hint` on `ha-input`, `helper` on `ha-textfield`). */
  hint?: string;
  /** Called with the committed value when the field fires `change`. */
  onChange: (value: string) => void;
}

export function haInputAvailable(registry: CustomElementRegistry | undefined = globalThis.customElements): boolean {
  return Boolean(registry?.get('ha-input'));
}

function readValue(event: Event): string {
  const target = event.target as { value?: unknown } | null;
  return typeof target?.value === 'string' ? target.value : '';
}

export function renderTextInput(options: TextInputOptions, useHaInput: boolean = haInputAvailable()): TemplateResult {
  const onChange = (event: Event): void => options.onChange(readValue(event));
  if (useHaInput) {
    return html`<ha-input
      .value=${options.value}
      label=${options.label}
      hint=${options.hint ?? nothing}
      @change=${onChange}
    ></ha-input>`;
  }
  return html`<ha-textfield
    .value=${options.value}
    label=${options.label}
    helper=${options.hint ?? nothing}
    @change=${onChange}
  ></ha-textfield>`;
}
