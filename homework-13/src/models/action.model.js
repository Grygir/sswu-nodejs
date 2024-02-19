import {Schema, model} from 'mongoose';
import * as crypto from 'crypto';

const actionSchema = new Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    userId: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['add_to_favourites', 'purchase', 'add_to_wishlist'],
        required: true,
    },
    book: {
        type: String,
        ref: 'Book',
        required: true
    }
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
        }
    },
    versionKey: false
});

actionSchema.virtual('id')
    .get(function() {
        return this._id;
    });

export default model('Action', actionSchema);
