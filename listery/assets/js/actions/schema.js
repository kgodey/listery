import { schema } from 'normalizr'


export const listItemSchema = new schema.Entity('listItems')
export const listItemListSchema = [ listItemSchema ]


export const listSchema = new schema.Entity('lists', {
	items: listItemListSchema
})
export const listListSchema = [ listSchema ]
