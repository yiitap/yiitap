import { BasicFeaturesArticle, BasicFeaturesArticleZh } from './article'
import { Diagram } from './diagram'
import { Table, TableZh } from './table'

const CONTENT_MAP: Record<string, { en: string; zh: string }> = {
  empty: { en: '', zh: '' },
  diagram: { en: Diagram, zh: Diagram },
  table: { en: Table, zh: TableZh },
}

const DEFAULT_CONTENT = {
  en: BasicFeaturesArticle,
  zh: BasicFeaturesArticleZh,
}

export const getData = (name = 'all', locale: 'en' | 'zh' = 'en') => {
  const source = CONTENT_MAP[name] || DEFAULT_CONTENT;
  return source[locale] ?? DEFAULT_CONTENT[locale];
}
