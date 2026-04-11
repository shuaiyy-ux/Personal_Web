export type Locale = 'en' | 'zh';

const STORAGE_KEY = 'site-locale';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Header
    'nav.blog': 'Blog',

    // Hero
    'hero.headline': "Let Machines Work, So We Don't Have To",
    'hero.subheadline': 'Automating the mundane. Amplifying the meaningful.',
    'hero.scroll': 'scroll',

    // Statement
    'statement.text': 'Less busywork. More leverage.',

    // Tools banner
    'tools.name': 'Finance Analyzer',
    'tools.badge': 'Tool',
    'tools.description': 'AI-powered document analysis — upload a PDF or TXT, get company sentiment scores, keyword extraction, and RAG-based deep insights. Runs entirely in your browser.',
    'tools.action': 'Launch tool',

    // Navigation
    'nav.blog.description': 'Where I distill ideas, break down complex systems, and share what I learn along the way.',
    'nav.blog.action': 'Read articles',
    'nav.linkedin.description': "Let's connect — always open to new opportunities and conversations.",
    'nav.linkedin.action': 'Connect',
    'nav.github.description': 'Code speaks louder. Check out my projects and experiments.',
    'nav.github.action': 'View code',
    'nav.email.description': 'Prefer inbox? Drop me a line.',
    'nav.email.action': 'Send email',
    'nav.fallback.description': 'Learn more or reach out here.',
    'nav.fallback.action': 'Open link',

    // Writing
    'writing.heading': 'Latest Writing',
    'writing.empty': 'No posts yet. Check back soon!',
    'writing.latest': 'Latest',
    'writing.date.tbd': 'TBD',

    // Blog listing
    'blog.eyebrow': 'All writing',
    'blog.heading': 'Recent posts',
    'blog.published': 'published',
    'blog.backHome': 'Back to homepage',
    'blog.hero.title': 'Less busywork. More leverage.',
    'blog.hero.lede': 'Essays and notes on automation, applied AI, and building systems that stay calm at scale.',

    // Blog post
    'post.eyebrow': 'Blog',
    'post.uploaded': 'Uploaded',
    'post.backBlog': 'Back to blog',
    'post.home': 'Home',
    'post.notFound.title': 'Post not found',
    'post.notFound.message': 'We couldn\'t find an article for',
    'post.skip': 'Skip to main content',

    // CTA
    'cta.heading': 'Ready to build something cool together?',
    'cta.button': "LET'S START",

    // Footer
    'footer.updated': 'Last updated:',

    // Language
    'lang.switch': '中文',
  },
  zh: {
    // Header
    'nav.blog': '博客',

    // Hero
    'hero.headline': '让机器工作，解放你的双手',
    'hero.subheadline': '自动化琐事，放大价值。',
    'hero.scroll': '下滑',

    // Statement
    'statement.text': '更少重复，更多杠杆。',

    // Tools banner
    'tools.name': '财务分析器',
    'tools.badge': '工具',
    'tools.description': 'AI 驱动的文档分析 — 上传 PDF 或 TXT，获取公司情绪评分、关键词提取和基于 RAG 的深度洞察。完全在浏览器中运行。',
    'tools.action': '启动工具',

    // Navigation
    'nav.blog.description': '在这里我提炼想法、拆解复杂系统，分享学到的一切。',
    'nav.blog.action': '阅读文章',
    'nav.linkedin.description': '期待连接 — 随时欢迎新的机会和交流。',
    'nav.linkedin.action': '建立连接',
    'nav.github.description': '代码胜于雄辩。看看我的项目和实验。',
    'nav.github.action': '查看代码',
    'nav.email.description': '想发邮件？写信给我。',
    'nav.email.action': '发送邮件',
    'nav.fallback.description': '了解更多或联系我。',
    'nav.fallback.action': '打开链接',

    // Writing
    'writing.heading': '最新文章',
    'writing.empty': '暂无文章，敬请期待！',
    'writing.latest': '最新',
    'writing.date.tbd': '待定',

    // Blog listing
    'blog.eyebrow': '全部文章',
    'blog.heading': '近期发布',
    'blog.published': '已发布',
    'blog.backHome': '返回首页',
    'blog.hero.title': '更少重复，更多杠杆。',
    'blog.hero.lede': '关于自动化、应用 AI 和构建稳定系统的文章与笔记。',

    // Blog post
    'post.eyebrow': '博客',
    'post.uploaded': '发布于',
    'post.backBlog': '返回博客',
    'post.home': '首页',
    'post.notFound.title': '文章未找到',
    'post.notFound.message': '未找到对应文章：',
    'post.skip': '跳转到正文',

    // CTA
    'cta.heading': '一起做点酷的事？',
    'cta.button': '开始合作',

    // Footer
    'footer.updated': '最后更新：',

    // Language
    'lang.switch': 'EN',
  },
};

export function getLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh' || stored === 'en') return stored;
  const browserLang = navigator.language;
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

export function setLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
  window.location.reload();
}

export function t(key: string): string {
  const locale = getLocale();
  return translations[locale][key] ?? translations.en[key] ?? key;
}

export function formatDateLocale(iso?: string): string {
  if (!iso) return t('writing.date.tbd');
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return t('writing.date.tbd');
  const locale = getLocale();
  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' });
}
