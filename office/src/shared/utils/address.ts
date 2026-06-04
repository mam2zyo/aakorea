export interface NormalizedAddress {
  postalCode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
}

export function normalizeAddressSelection(data: Record<string, unknown>): NormalizedAddress {
  return {
    postalCode: String(data?.zonecode ?? '').trim(),
    address: String(data?.roadAddress || data?.address || '').trim(),
    roadAddress: String(data?.roadAddress || '').trim(),
    jibunAddress: String(data?.jibunAddress || '').trim(),
    sido: String(data?.sido ?? '').trim(),
    sigungu: String(data?.sigungu ?? '').trim(),
  }
}

export function hasPostalContact(postalContact: Record<string, unknown> | null | undefined) {
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

export function formatPostalContact(postalContact: Record<string, unknown> | null | undefined) {
  if (!hasPostalContact(postalContact)) {
    return '-'
  }

  const locationText = [String(postalContact?.roadAddress || ''), String(postalContact?.detailAddress || '')]
    .filter(Boolean)
    .join(' ')

  return [String(postalContact?.recipient || ''), String(postalContact?.postalCode || ''), locationText]
    .filter(Boolean)
    .join(' / ')
}
