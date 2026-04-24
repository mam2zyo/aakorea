export function normalizeAddressSelection(data: any) {
  return {
    postalCode: data?.zonecode?.trim() ?? '',
    address: (data?.roadAddress || data?.address || '').trim(),
    roadAddress: (data?.roadAddress || '').trim(),
    jibunAddress: (data?.jibunAddress || '').trim(),
    sido: data?.sido?.trim() ?? '',
    sigungu: data?.sigungu?.trim() ?? '',
  }
}

export function hasPostalContact(postalContact: any) {
  if (!postalContact) {
    return false
  }

  return Boolean(
    postalContact.recipient ||
      postalContact.postalCode ||
      postalContact.roadAddress ||
      postalContact.detailAddress
  )
}

export function formatPostalContact(postalContact: any) {
  if (!hasPostalContact(postalContact)) {
    return '-'
  }

  const locationText = [postalContact.roadAddress, postalContact.detailAddress]
    .filter(Boolean)
    .join(' ')

  return [postalContact.recipient, postalContact.postalCode, locationText]
    .filter(Boolean)
    .join(' / ')
}
