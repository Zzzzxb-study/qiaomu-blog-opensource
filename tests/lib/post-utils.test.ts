import { describe, expect, it } from 'vitest'
import { cleanPostDescription } from '@/lib/post-utils'

describe('cleanPostDescription', () => {
  it('keeps a normal summary and normalizes whitespace', () => {
    expect(cleanPostDescription('  一段\n正常的   摘要。  ')).toBe('一段 正常的 摘要。')
  })

  it('extracts the description when imported front matter leaked into the summary', () => {
    expect(
      cleanPostDescription(
        'title: 测试文章 subtitle: 副标题 date: 2026-08-09 author: RiskAI tags: 风险 AI description: 真正应该展示的摘要',
      ),
    ).toBe('真正应该展示的摘要')
  })

  it('hides malformed front matter without a description field', () => {
    expect(cleanPostDescription('title: 测试文章 author: RiskAI tags: 风险')).toBeNull()
  })

  it('handles empty values', () => {
    expect(cleanPostDescription(null)).toBeNull()
    expect(cleanPostDescription('   ')).toBeNull()
  })
})
