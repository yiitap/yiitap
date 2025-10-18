/**
 * Empty Blocks
 */

export const EmptyParagraph = [
  {
    type: 'paragraph',
    content: [],
  },
]

export const EmptyListItem = [
  {
    type: 'listItem',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
]

export const EmptyTaskItem = [
  {
    type: 'taskItem',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  },
]

export const EmptyDetails = [
  {
    type: 'details',
    attrs: {
      open: false,
    },
    content: [
      {
        type: 'detailsSummary',
        content: [],
      },
      {
        type: 'detailsContent',
        content: EmptyParagraph,
      },
    ],
  },
]
