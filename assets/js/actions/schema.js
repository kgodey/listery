import { schema } from 'normalizr'


export const listSchema = new schema.Entity('lists')
export const listListSchema = [ listSchema ]

export const listItemSchema = new schema.Entity('listItems')
export const listItemListSchema = [ listItemSchema ]
