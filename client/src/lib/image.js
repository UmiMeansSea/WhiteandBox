export function optimizeImageUrl(url, width = 800, quality = 60) {
  if (!url || typeof url !== 'string') return url
  const trimmed = url.trim()
  if (!trimmed.startsWith('http')) return trimmed

  if (trimmed.includes('images.unsplash.com')) {
    const joiner = trimmed.includes('?') ? '&' : '?'
    return `${trimmed}${joiner}auto=format&fit=crop&w=${width}&q=${quality}`
  }

  return trimmed
}

