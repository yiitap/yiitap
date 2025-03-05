import { Extension } from '@tiptap/core'
import { uuvidv4 } from '../../utils/uuid'

const OUniqueID = Extension.create({
	name: 'uniqueID',
	priority: 10000,

	addOptions: () => ({
		attributeName: 'data-id',
		types: ['heading'],
		enableRender: false,
		generateId: () => {
			const id = uuvidv4()
			// console.log('generateId', id)
			return id
		},
	}),

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					[this.options.attributeName]: {
						default: this.options.generateId(),
						parseHTML: (element) => {
							return element.getAttribute(this.options.attributeName)
						},
						renderHTML: (attributes) => {
							return this.options.enableRender
								? {
										[this.options.attributeName]:
											attributes[this.options.attributeName],
								  }
								: {}
						},
					},
				},
			},
		]
	},
})

export default OUniqueID
