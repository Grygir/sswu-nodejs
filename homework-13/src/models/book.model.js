import {Schema, model} from 'mongoose';

const bookSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type:String,
        required: true
    },
    author: {
        type:String,
        required: true
    },
    genres: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
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