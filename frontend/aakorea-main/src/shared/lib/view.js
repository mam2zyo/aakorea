export function lookupLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function syncSelectionWithList(previous, key, items) {
  if (items.length === 0) {
    if (previous[key] === '') {
      return previous
    }

    return {
      ...previous,
      [key]: '',
    }
  }

  const hasSelectedValue = items.some((item) => String(item.id) === previous[key])
  if (hasSelectedValue) {
    return previous
  }

  return {
    ...previous,
    [key]: String(items[0].id),
  }
}
