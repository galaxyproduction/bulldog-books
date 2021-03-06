const { Schema, model } = require('mongoose')
// const { cartItemSchema } = require('./CartItem.schema')

const OBJECT_ID = Schema.Types.ObjectId

const cart = Schema({
    user: 
    { 
        type: OBJECT_ID, 
        ref: 'User',
        required: true
    },
    books: {
        type: [{ book: OBJECT_ID, bookQuantity: Number}],
    }
})

module.exports = model('Cart', cart)
