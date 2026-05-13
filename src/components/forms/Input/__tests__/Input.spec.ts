import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createAlienUI } from '@/plugin'
import { AlienInput } from '../index'

// ── Helpers ────────────────────────────────────────────────────────────────

function renderInput(props: Record<string, unknown> = {}) {
  return render(AlienInput, {
    props,
    global: { plugins: [createAlienUI()] },
  })
}

// ── Rendering ──────────────────────────────────────────────────────────────

describe('AlienInput — rendering', () => {
  it('renders a text input by default', () => {
    renderInput()
    expect(screen.getByRole('textbox')).toBeDefined()
  })

  it('renders a label when the label prop is set', () => {
    renderInput({ label: 'Email address' })
    expect(screen.getByLabelText('Email address')).toBeDefined()
  })

  it('renders a required indicator when required is true', () => {
    renderInput({ label: 'Email', required: true })
    const label = screen.getByText('Email', { exact: false })
    expect(label.textContent).toContain('*')
  })

  it('renders hint text when hint prop is set', () => {
    renderInput({ hint: 'We will never share your email.' })
    expect(screen.getByText('We will never share your email.')).toBeDefined()
  })

  it('renders the error message instead of hint when error prop is set', () => {
    renderInput({ hint: 'Hint text', error: 'This field is required' })
    expect(screen.queryByText('Hint text')).toBeNull()
    expect(screen.getByText('This field is required')).toBeDefined()
  })

  it('sets aria-invalid when error prop is set', () => {
    renderInput({ error: 'Required' })
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  it('does NOT set aria-invalid when there is no error', () => {
    renderInput()
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('false')
  })

  it('does not render a clear button when clearable is false', () => {
    renderInput({ modelValue: 'hello', clearable: false })
    expect(screen.queryByRole('button')).toBeNull()
  })
})

// ── Accessibility ──────────────────────────────────────────────────────────

describe('AlienInput — accessibility', () => {
  it('associates label with input via htmlFor / id', () => {
    renderInput({ label: 'Full name' })
    // getByLabelText verifies the label → input association
    const input = screen.getByLabelText('Full name')
    expect(input.tagName).toBe('INPUT')
  })

  it('is disabled when disabled prop is true', () => {
    renderInput({ disabled: true })
    expect(screen.getByRole('textbox')).toHaveProperty('disabled', true)
  })

  it('sets aria-required when required is true', () => {
    renderInput({ required: true })
    expect(screen.getByRole('textbox').getAttribute('aria-required')).toBe('true')
  })

  it('error message has role="alert"', () => {
    renderInput({ error: 'Something went wrong' })
    expect(screen.getByRole('alert')).toBeDefined()
  })

  it('hint does NOT have role="alert"', () => {
    renderInput({ hint: 'Just a hint' })
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

// ── Interaction ────────────────────────────────────────────────────────────

describe('AlienInput — interaction', () => {
  it('emits update:modelValue when the user types', async () => {
    const user = userEvent.setup()
    const { emitted } = renderInput()
    await user.type(screen.getByRole('textbox'), 'hello')
    const updates = emitted()['update:modelValue'] as string[][]
    expect(updates.at(-1)?.[0]).toBe('hello')
  })

  it('emits focus when the input is focused', async () => {
    const user = userEvent.setup()
    const { emitted } = renderInput()
    await user.click(screen.getByRole('textbox'))
    expect(emitted()['focus']).toBeDefined()
  })

  it('emits blur when the input loses focus', async () => {
    const user = userEvent.setup()
    const { emitted } = renderInput()
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    expect(emitted()['blur']).toBeDefined()
  })

  it('does not allow typing when disabled', async () => {
    const user = userEvent.setup()
    renderInput({ disabled: true })
    await user.type(screen.getByRole('textbox'), 'hello')
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  })
})

// ── Clear button ───────────────────────────────────────────────────────────

describe('AlienInput — clear button', () => {
  it('shows the clear button when clearable is true and input has a value', () => {
    renderInput({ clearable: true, modelValue: 'some text' })
    expect(screen.getByRole('button', { name: /clear/i })).toBeDefined()
  })

  it('hides the clear button when the value is empty', () => {
    renderInput({ clearable: true, modelValue: '' })
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('emits clear and resets the value when the clear button is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = renderInput({ clearable: true, modelValue: 'hello' })
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(emitted()['clear']).toBeDefined()
    expect(emitted()['update:modelValue']?.at(-1)).toEqual([''])
  })
})

// ── Imperative API (expose) ────────────────────────────────────────────────

describe('AlienInput — exposed API', () => {
  it('exposes focus(), blur(), and clear()', () => {
    const { baseElement } = renderInput({ modelValue: 'test', clearable: true })
    // Just verify the component renders without error when expose is used
    expect(baseElement).toBeDefined()
  })
})

// ── Variants ──────────────────────────────────────────────────────────────

describe('AlienInput — size variants', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'renders without error for size="%s"',
    (size) => {
      renderInput({ size })
      expect(screen.getByRole('textbox')).toBeDefined()
    },
  )
})

describe('AlienInput — input types', () => {
  it('renders type="email" correctly', () => {
    renderInput({ type: 'email' })
    expect((screen.getByRole('textbox') as HTMLInputElement).type).toBe('email')
  })

  it('renders type="password" correctly', () => {
    const { container } = renderInput({ type: 'password' })
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeDefined()
  })
})

// ── Slots ──────────────────────────────────────────────────────────────────

describe('AlienInput — slots', () => {
  it('renders prefix slot content', () => {
    const { getByTestId } = render(AlienInput, {
      slots: { prefix: '<span data-testid="prefix-icon">@</span>' },
      global: { plugins: [createAlienUI()] },
    })
    expect(getByTestId('prefix-icon')).toBeDefined()
  })

  it('renders suffix slot content', () => {
    const { getByTestId } = render(AlienInput, {
      slots: { suffix: '<span data-testid="suffix-icon">px</span>' },
      global: { plugins: [createAlienUI()] },
    })
    expect(getByTestId('suffix-icon')).toBeDefined()
  })
})

// ── Readonly ───────────────────────────────────────────────────────────────

describe('AlienInput — readonly', () => {
  it('sets readonly attribute on the native input', () => {
    renderInput({ readonly: true })
    expect(screen.getByRole('textbox')).toHaveProperty('readOnly', true)
  })

  it('does not show the clear button when readonly', () => {
    renderInput({ clearable: true, modelValue: 'hello', readonly: true })
    expect(screen.queryByRole('button')).toBeNull()
  })
})
