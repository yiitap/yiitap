declare global {
  type Indexable<T = any> = {
    [key: string]: T
  }

  interface KeyValue {
    key: string
    value: any
  }

  interface OptionValue {
    label: string
    value: string | number
    name?: string
    icon?: string
  }

  interface BlockOption {
    label: string
    value: string
    keywords?: string
    icon?: string
    color?: string
    tips?: string
    group?: string
    filter?: string
    style?: boolean
    options?: Indexable
    component?: string
    children?: BlockOption[]
  }

  interface AiOption {
    provider: string
    baseURL?: string
    apiKey: string
    config?: Indexable
  }

  type ChatMessageRole = 'system' | 'user' | 'assistant'

  interface ChatMessage {
    role: ChatMessageRole
    content: string
  }
}
export {}
