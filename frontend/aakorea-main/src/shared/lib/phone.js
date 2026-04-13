const PHONE_FIELDS = new Set(['phone', 'contactPhoneOverride'])

export function formatKoreanPhoneNumber(value = '') {
  const digits = String(value ?? '').replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (/^(15|16|18)\d*/.test(digits)) {
    return formatServiceNumber(digits.slice(0, 8))
  }

  if (digits.startsWith('02')) {
    return formatPhoneSegments(digits.slice(0, 10), 2)
  }

  return formatPhoneSegments(digits.slice(0, 11), 3)
}

export function normalizePhoneFieldValue(field, value) {
  if (!PHONE_FIELDS.has(field)) {
    return value
  }

  return formatKoreanPhoneNumber(value)
}

function formatServiceNumber(digits) {
  if (digits.length <= 4) {
    return digits
  }

  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

function formatPhoneSegments(digits, prefixLength) {
  if (digits.length <= prefixLength) {
    return digits
  }

  const prefix = digits.slice(0, prefixLength)
  const middleLength = resolveMiddleLength(digits.length, prefixLength)
  const middle = digits.slice(prefixLength, prefixLength + middleLength)
  const suffix = digits.slice(prefixLength + middleLength)

  if (!suffix) {
    return `${prefix}-${middle}`
  }

  return `${prefix}-${middle}-${suffix}`
}

function resolveMiddleLength(totalLength, prefixLength) {
  if (prefixLength === 2) {
    return totalLength <= 9 ? 3 : 4
  }

  return totalLength <= 10 ? 3 : 4
}
