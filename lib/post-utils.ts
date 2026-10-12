export function sanitizePostSlugInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/_{2,}/g, '_')
}

export function normalizePostSlug(value: string): string {
  return sanitizePostSlugInput(value)
    .replace(/^[-_]+|[-_]+$/g, '')
}

export function buildAutoDescription(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  return normalized.slice(0, maxLength)
}

/**
 * Older imports can accidentally save YAML front matter as the post summary.
 * Keep the stored value untouched, but present the actual description to public pages.
 */
export function cleanPostDescription(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return null

  const looksLikeFrontMatter = /^title\s*:/i.test(normalized)
  if (!looksLikeFrontMatter) return normalized

  const descriptionMatch = normalized.match(/\bdescription\s*:\s*(.+)$/i)
  if (descriptionMatch?.[1]) {
    return descriptionMatch[1].trim() || null
  }

  return null
}
