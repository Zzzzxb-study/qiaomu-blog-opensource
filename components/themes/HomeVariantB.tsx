'use client'

// Variant B: RiskAI editorial home
// A content-first homepage built around positioning, one lead story and three reading paths.

import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchEntry } from '@/components/SearchEntry'
import { Pagination } from '@/components/Pagination'
import { ThemeDropdown } from '@/components/ThemeDropdown'
import type { HomeProps } from '@/components/HomeClient'
import type { PostWithTags } from '@/lib/db'
import type { SiteCategoryLink, SiteNavLink } from '@/lib/site'
import { BRAND } from '@/lib/brand'

const TOPIC_BLUEPRINTS = [
  {
    index: '01',
    title: '风险与保险',
    description: '从核保、产品和真实业务场景出发，拆解风险判断背后的依据。',
    query: '风险',
    keywords: ['保险', '风险', '核保', '运营'],
  },
  {
    index: '02',
    title: 'AI 与生产力',
    description: '不追逐空洞概念，只记录真正改变工作方法的工具、流程和实践。',
    query: 'AI',
    keywords: ['AI', '人工智能', 'AI工具', '自动化'],
  },
  {
    index: '03',
    title: '数字生活与安全',
    description: '看懂账号、网络和数字工具背后的风险，不被一个分数或一句话误导。',
    query: '网络',
    keywords: ['网络', '安全', '账号', '数字'],
  },
] as const

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getIssueInfo() {
  const now = new Date()
  return {
    vol: Math.max(1, now.getFullYear() - 2023),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
}

function matchesTopic(post: PostWithTags, keywords: readonly string[]) {
  const haystack = [post.title, post.description ?? '', post.category ?? '', ...post.tags]
    .join(' ')
    .toLowerCase()

  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
}

function buildTopicCards(posts: PostWithTags[], categories: SiteCategoryLink[]) {
  return TOPIC_BLUEPRINTS.map((topic) => {
    const matchedPosts = posts.filter((post) => matchesTopic(post, topic.keywords))
    const matchingCategory = categories.find((category) =>
      topic.keywords.some((keyword) => category.name.toLowerCase().includes(keyword.toLowerCase())),
    )

    return {
      ...topic,
      count: matchedPosts.length,
      leadTitle: matchedPosts[0]?.title ?? null,
      href: matchingCategory
        ? `/category/${matchingCategory.slug}`
        : `/search?q=${encodeURIComponent(topic.query)}`,
    }
  })
}

function EditorialHeader({
  initialTheme,
  navLinks,
  categories,
}: {
  initialTheme: HomeProps['initialTheme']
  navLinks: SiteNavLink[]
  categories: SiteCategoryLink[]
}) {
  const defaultLinks = [
    { label: 'GitHub', url: BRAND.githubUrl, openInNewTab: true },
    { label: 'RSS', url: '/feed.xml', openInNewTab: false },
  ]
  const links = navLinks.length > 0 ? navLinks : defaultLinks
  const { vol, month, year } = getIssueInfo()

  return (
    <header className="risk-home-header">
      <div className="risk-home-header-main">
        <Link href="/" className="risk-home-brand" aria-label={`${BRAND.name} 首页`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/riskai-wordmark.png" alt="" width={118} height={78} />
          <span>
            <strong>{BRAND.name}</strong>
            <small>风险 · AI · 实践</small>
          </span>
        </Link>

        <div className="risk-home-issue" aria-label={`第 ${vol} 卷，${year} 年 ${month} 月`}>
          VOL. {vol} · {year}.{String(month).padStart(2, '0')}
        </div>

        <nav className="risk-home-nav" aria-label="主导航">
          {links.map((link) =>
            link.url.startsWith('http') ? (
              <a
                key={link.label}
                href={link.url}
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.url}>
                {link.label}
              </Link>
            ),
          )}
          <ThemeDropdown
            initialTheme={initialTheme}
            buttonStyle={{ color: 'inherit', fontFamily: 'inherit', fontSize: 12 }}
            dropdownStyle={{ background: '#f5efe6', border: '1px solid #d9cec0' }}
            itemStyle={{ color: '#241915', fontSize: 12 }}
            activeItemStyle={{ background: '#5b1818', color: '#fffaf1' }}
          />
          <SearchEntry />
        </nav>
      </div>

      {categories.length > 0 && (
        <nav className="risk-home-category-rail" aria-label="文章分类">
          <span>阅读方向</span>
          {categories.slice(0, 7).map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export function HomeVariantB({
  initialTheme,
  posts,
  categories,
  navLinks,
  currentPage,
  totalPages,
}: HomeProps) {
  const featured = posts[0] ?? null
  const rest = posts.slice(1)
  const topicCards = buildTopicCards(posts, categories)

  return (
    <div className="theme-home-editorial risk-home-shell">
      <a className="risk-home-skip" href="#main-content">
        跳到正文
      </a>

      <EditorialHeader
        initialTheme={initialTheme}
        navLinks={navLinks}
        categories={categories}
      />

      <main id="main-content">
        <section className="risk-home-hero" aria-labelledby="risk-home-title">
          <div className="risk-home-hero-copy">
            <p className="risk-home-eyebrow">RISK × AI × PRACTICE</p>
            <h1 id="risk-home-title">用风险视角，讲明白保险、AI 与现实世界。</h1>
            <p className="risk-home-intro">
              这里记录核保实务、AI 工具和数字生活中的真实问题。尽量把复杂的事情说明白，把判断依据留下来。
            </p>
            <div className="risk-home-hero-actions">
              {featured && <a href="#today-featured">阅读今日精选 ↓</a>}
              <a href="#latest-posts">浏览全部文章</a>
            </div>
          </div>

          <aside className="risk-home-manifesto" aria-label="RiskAI 编辑原则">
            <div className="risk-home-manifesto-mark">R/A</div>
            <p>不贩卖确定性。先区分事实、判断和未知，再给出能够落地的结论。</p>
            <dl>
              <div>
                <dt>{posts.length}</dt>
                <dd>本期文章</dd>
              </div>
              <div>
                <dt>{categories.length}</dt>
                <dd>阅读分类</dd>
              </div>
            </dl>
          </aside>
        </section>

        {featured ? (
          <section id="today-featured" className="risk-home-section risk-home-featured-section" aria-labelledby="featured-title">
            <div className="risk-home-section-heading">
              <div>
                <p>EDITOR&apos;S PICK · 今日精选</p>
                <h2 id="featured-title">先读这一篇</h2>
              </div>
              <span>01 / {String(posts.length).padStart(2, '0')}</span>
            </div>

            <Link href={`/${featured.slug}`} className="risk-home-featured-card">
              <div className="risk-home-featured-copy">
                <div className="risk-home-featured-meta">
                  <span>{featured.category || '观点'}</span>
                  <time dateTime={new Date(featured.published_at * 1000).toISOString()}>
                    {formatDate(featured.published_at)}
                  </time>
                  {featured.is_pinned === 1 && <em>编辑置顶</em>}
                </div>
                <h3>{featured.title}</h3>
                {featured.description && <p>{featured.description}</p>}
                <span className="risk-home-read-link">阅读全文 <b aria-hidden="true">↗</b></span>
              </div>
              <div className="risk-home-featured-art" aria-hidden="true">
                <span>RISK</span>
                <strong>01</strong>
                <span>AI</span>
              </div>
            </Link>
          </section>
        ) : (
          <section className="risk-home-empty" aria-labelledby="empty-title">
            <p>EDITORIAL DESK</p>
            <h2 id="empty-title">第一篇文章正在准备中</h2>
            <span>发布后，它会在这里成为今日精选。</span>
          </section>
        )}

        <section className="risk-home-section risk-home-topics" aria-labelledby="topics-title">
          <div className="risk-home-section-heading">
            <div>
              <p>READING PATHS · 阅读路线</p>
              <h2 id="topics-title">从一个问题开始，而不是从时间线开始</h2>
            </div>
            <span>三个长期方向</span>
          </div>

          <div className="risk-home-topic-grid">
            {topicCards.map((topic) => (
              <Link key={topic.index} href={topic.href} className="risk-home-topic-card">
                <div className="risk-home-topic-number">{topic.index}</div>
                <div>
                  <div className="risk-home-topic-kicker">
                    {topic.count > 0 ? `${topic.count} 篇相关内容` : '持续更新'}
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  {topic.leadTitle && <small>最近收录：{topic.leadTitle}</small>}
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="latest-posts" className="risk-home-section risk-home-latest" aria-labelledby="latest-title">
          <div className="risk-home-section-heading">
            <div>
              <p>THE INDEX · 最新发布</p>
              <h2 id="latest-title">继续阅读</h2>
            </div>
            <span>{rest.length} 篇</span>
          </div>

          {rest.length > 0 ? (
            <div className="risk-home-post-list">
              {rest.map((post, index) => (
                <Link key={post.slug} href={`/${post.slug}`} className="risk-home-post-row">
                  <div className="risk-home-post-number">{String(index + 2).padStart(2, '0')}</div>
                  <div className="risk-home-post-main">
                    <div className="risk-home-post-meta">
                      <span>{post.category || '观点'}</span>
                      <time dateTime={new Date(post.published_at * 1000).toISOString()}>
                        {formatDate(post.published_at)}
                      </time>
                    </div>
                    <h3>{post.title}</h3>
                    {post.description && <p>{post.description}</p>}
                  </div>
                  <div className="risk-home-post-arrow" aria-hidden="true">↗</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="risk-home-list-empty">更多文章发布后会显示在这里。</p>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
        </section>

        <section className="risk-home-follow" aria-labelledby="follow-title">
          <div>
            <p>KEEP THE SIGNAL</p>
            <h2 id="follow-title">不追热点，持续跟进值得判断的问题。</h2>
          </div>
          <div className="risk-home-follow-links">
            <a href="/feed.xml">订阅 RSS ↗</a>
            <a href={BRAND.repositoryUrl} target="_blank" rel="noopener noreferrer">查看开源项目 ↗</a>
          </div>
        </section>
      </main>

      <div className="risk-home-footer-strip">
        <span>© {new Date().getFullYear()} {BRAND.name}</span>
        <span>独立 · 可核验 · RSS 友好</span>
      </div>
      <SiteFooter />
    </div>
  )
}
