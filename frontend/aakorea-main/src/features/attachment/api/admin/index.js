export const adminAttachmentApi = {
  async uploadAttachment(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/attachments', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw error
    }

    const { data } = await response.json()
    return data
  },
}
