export function getApiFieldErrors(error: any): Record<string, string> | null {
  if (error?.response?.data?.errors) {
    return error.response.data.errors;
  }
  return null;
}

export function omitFieldErrors(errors: Record<string, string>, field: string): Record<string, string> {
  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
}

export function readFieldError(errors: Record<string, string> | null, field: string): string | null {
  return errors ? errors[field] || null : null;
}
