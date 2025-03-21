/**
 * AI
 */
export const AiProviders: Indexable = {
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    name: 'DeepSeek',
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    name: 'OpenAI',
  },
}

export const getProviderProp = (name: string, prop: string) => {
  const provider = AiProviders[name]
  return provider ? provider[prop] : null
}

export const Prompts: Indexable = {
  writing:
    'You are a professional writing assistant. Please answer in [LANGUAGE].',
}
