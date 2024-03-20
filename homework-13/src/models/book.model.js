import {Schema, model} from 'mongoose';

const bookSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authors: [{
        type: String,
        required: true
    }],
    genres: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    bestsellers: {
        type: Number,
        default: () => 0
    },
    mostWanted: {
        type: Number,
        default: () => 0
    },
    favourites: {
        type: Number,
        default: () => 0
    }
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.bestsellers;
            delete ret.mostWanted;
            delete ret.favourites;
        }
    }
});

bookSchema.virtual('id')
    .get(function() {
        return this._id;
    })
    .set(function(value) {
        this.set('_id', value)
    });


export default model('Book', bookSchema);
