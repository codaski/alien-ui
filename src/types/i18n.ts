/**
 * Alien UI — i18n message schema type.
 *
 * This type describes the full shape of an Alien UI locale file.
 * It is used to enforce completeness of the default `en.json` and to
 * provide autocomplete when consumers add their own translations.
 */

export interface AlienMessages {
  'alien-ui': {
    // ── Common ───────────────────────────────────────────────────────────
    common: {
      clear:    string
      close:    string
      search:   string
      loading:  string
      select:   string
      required: string
    }

    // ── Form fields ───────────────────────────────────────────────────────
    input: {
      placeholder: string
      clear:       string
    }
    textarea: {
      placeholder:     string
      charactersLeft:  string  // "{count} characters left"
    }
    select: {
      placeholder:  string
      noOptions:    string
      searchPlaceholder: string
    }
    checkbox: {
      label: string
    }
    datepicker: {
      placeholder: string
      clear:       string
    }
    fileupload: {
      prompt:     string
      or:         string
      browse:     string
      maxSize:    string   // "Max file size: {size}"
      typeError:  string   // "File type not allowed"
      sizeError:  string   // "File exceeds max size"
    }

    // ── Validation messages ───────────────────────────────────────────────
    validation: {
      required:     string   // "This field is required"
      email:        string   // "Enter a valid email address"
      minLength:    string   // "Minimum {min} characters"
      maxLength:    string   // "Maximum {max} characters"
      min:          string   // "Minimum value is {min}"
      max:          string   // "Maximum value is {max}"
      pattern:      string   // "Invalid format"
      url:          string   // "Enter a valid URL"
      numeric:      string   // "Must be a number"
      integer:      string   // "Must be a whole number"
    }

    // ── Blocks ────────────────────────────────────────────────────────────
    modal: {
      close: string
    }
    drawer: {
      close: string
    }
    toast: {
      dismiss: string
    }
  }
}
