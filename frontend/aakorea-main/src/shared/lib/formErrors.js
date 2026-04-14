import { ApiError } from '@/shared/api'

export function getApiFieldErrors(error) {
  if (!(error instanceof ApiError) || !error.fields) {
    return null
  }

  return error.fields
}

export function readFieldError(errors, ...keys) {
  for (const key of keys) {
    if (key && errors[key]) {
      return errors[key]
    }
  }

  return null
}

export function omitFieldErrors(errors, ...keys) {
  if (!errors || Object.keys(errors).length === 0) {
    return {}
  }

  const nextErrors = { ...errors }

  keys.forEach((key) => {
    if (key) {
      delete nextErrors[key]
    }
  })

  return nextErrors
}
