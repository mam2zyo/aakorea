export function getApiFieldErrors(error: unknown): Record<string, string> | null {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { errors?: Record<string, string> } } };
    return axiosError.response?.data?.errors ?? null;
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
