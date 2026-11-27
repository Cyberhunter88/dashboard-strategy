// @vitest-environment happy-dom
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { haInputAvailable, renderTextInput } from './text-input';

function mount(useHaInput: boolean, onChange = vi.fn()) {
  const root = document.createElement('div');
  render(renderTextInput({ label: 'Entities', value: 'light.a', hint: 'Comma separated', onChange }, useHaInput), root);
  return { root, onChange };
}

describe('renderTextInput', () => {
  it('renders ha-input with hint on current Home Assistant', () => {
    const { root } = mount(true);
    const field = root.querySelector('ha-input') as HTMLElement & { value?: string };
    expect(field).not.toBeNull();
    expect(root.querySelector('ha-textfield')).toBeNull();
    expect(field.getAttribute('label')).toBe('Entities');
    expect(field.getAttribute('hint')).toBe('Comma separated');
    expect(field.value).toBe('light.a');
  });

  it('falls back to ha-textfield with helper on older Home Assistant', () => {
    const { root } = mount(false);
    const field = root.querySelector('ha-textfield') as HTMLElement;
    expect(field).not.toBeNull();
    expect(field.getAttribute('helper')).toBe('Comma separated');
  });

  it('passes the committed value to onChange', () => {
    const { root, onChange } = mount(true);
    const field = root.querySelector('ha-input') as HTMLElement & { value?: string };
    field.value = 'light.b, light.c';
    field.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(onChange).toHaveBeenCalledWith('light.b, light.c');
  });

  it('detects ha-input from the element registry', () => {
    expect(haInputAvailable({ get: () => undefined } as unknown as CustomElementRegistry)).toBe(false);
    expect(haInputAvailable({ get: () => class {} } as unknown as CustomElementRegistry)).toBe(true);
    expect(haInputAvailable(undefined)).toBe(false);
  });
});
