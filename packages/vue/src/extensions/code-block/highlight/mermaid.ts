import type { HLJSApi, Language } from 'highlight.js'

/**
 * @see https://github.com/react18-tools/lowlight-mermaid
 * @see https://github.com/bpruitt-goddard/vscode-mermaid-syntax-highlight
 */
export const mermaidGrammar = (hljs: HLJSApi): Language => ({
  name: 'Mermaid',
  aliases: ['mermaid'],
  case_insensitive: true,
  contains: [
    /**
     * Comments
     * Mermaid uses `%%` for line comments.
     */
    hljs.COMMENT(/%%(?!\{)/, /$/),

    /**
     * Directives
     * Block-style config like: %%{ init: { 'theme': 'dark' } }%%
     * Highlight the whole directive as `meta`,
     * with keys and values tokenized inside.
     */
    {
      className: 'meta',
      begin: /%%\{/,
      end: /\}%%/,
      contains: [
        {
          className: 'attr',
          begin: /[A-Za-z][A-Za-z0-9_-]*(?=\s*:)/,
        },
        {
          className: 'string',
          begin: /:\s*/,
          end: /(?=(,\s*[A-Za-z]|$))/,
          excludeBegin: true,
        },
      ],
    },

    /**
     * YAML frontmatter
     * Optional config section at the top, delimited by --- lines.
     */
    {
      className: 'meta',
      begin: /^---$/,
      end: /^---$/,
      contains: [
        {
          className: 'attr',
          begin: /\b[A-Za-z][A-Za-z0-9_-]*(?=\s*:)/,
        },
        {
          className: 'string',
          begin: /:\s*/,
          end: /$/,
          excludeBegin: true,
        },
      ],
    },

    /**
     * Diagram keywords
     * Cover all supported diagram types and optional direction (LR, TB, RL, BT).
     */
    {
      className: 'keyword',
      begin:
        /(^|\s)(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|pie|gantt|requirement|sankey|timeline|quadrant|gitGraph|mindmap|xychart|block|packet|kanban|architecture|radar|treemap|C4Context)(?:\s+(?:LR|TB|RL|BT))?\b/,
    },

    /**
     * Diagram built-in words
     */
    {
      className: 'built_in',
      begin:
        /^(?:\s*)(participant|loop|end|Note right of|note|class|title|section|dateFormat|x-axis|y-axis|bar|line)\b/,
    },

    /**
     * Connectors / edges
     * Flow arrows, class/ER relationships, lifeline arrows, etc.
     */
    {
      className: 'symbol',
      begin:
        /(<<?-+>?|--+>|==+>|->|-\.-|==|->>|-->>|<\|--|--\|>|<\|>|:>|o--o|x--x|\*--|o\{--|\}o--)/,
      relevance: 20,
    },

    /**
     * Sequence diagram messages
     * Example: A->>B: message text
     */
    {
      className: 'literal',
      begin: /\b[A-Za-z0-9_]+\s*-[->]+[A-Za-z0-9_]+\s*:/,
      end: /$/,
      contains: [
        {
          className: 'string',
          begin: /:\s*/,
          end: /$/,
          excludeBegin: true,
        },
      ],
    },

    /**
     * Node shapes
     * Rectangles, rounds, circles, diamonds, trapezoids, links, etc.
     */
    {
      className: 'regexp',
      variants: [
        { begin: /\[[^\]]+\]/ }, // [rect]
        { begin: /\([^)]+\)/ }, // (round)
        { begin: /\(\([^)]+\)\)/ }, // ((circle))
        { begin: /\{[^}]+\}/ }, // {diamond}
        { begin: />[^<]+</ }, // >trapezoid<
        { begin: /\[\[[^\]]+\]\]/ }, // [[link]]
      ],
    },

    /**
     * Notes
     * Example: note left of A: This is a note
     */
    {
      className: 'string',
      begin: /note\s+(?:left|right|top|bottom)\s+of\s+[A-Za-z0-9_]+/i,
    },

    /**
     * Quoted text
     * Often used for labels or annotations.
     */
    {
      className: 'string',
      variants: [{ begin: /'.*?'/ }, { begin: /".*?"/ }],
    },

    /**
     * Numbers
     * Common in gantt/journey/timeline diagrams.
     */
    {
      className: 'number',
      begin: /\b\d+([:.]\d+)?\b/,
    },
  ],
})
