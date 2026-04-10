import { ApiError } from '../../../../shared/lib/request'

export const adminAssetApi = {
  async uploadAsset(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/assets', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })

    let text, json
    try {
      text = await response.text()
    } catch {
      // Failed to read response text, likely network error
    }
    try {
      if (text) json = JSON.parse(text)
    } catch {
      // Failed to parse response, might be non-JSON error page
    }

    if (!response.ok) {
      const error = json?.error
      throw new ApiError(error?.message ?? 'asset upload failed', {
        code: error?.code ?? null,
        fields: error?.fields ?? null,
        status: response.status,
      })
    }

    return json?.data ?? json
  },
}
