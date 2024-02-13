import Book from '../models/book.model.js'
import Action from '../models/action.model.js'

const actionToBookField = {
    'purchase': 'bestsellers',
    'add_to_wishlist': 'mostWanted',
    'add_to_favourites': 'favourites'
};

export const addAction = async (actionObj) => {
    let book = await Book.findOne({_id: actionObj.book.id});
    if (!book) {
        book = await Book.create(actionObj.book);
    }
    const action = new Action(actionObj);
    action.book = book._id;
    await action.save();
    book.$inc(actionToBookField[action.action], 1);
    await book.save();
    await action.populate('book');
    return action;
}

export const recommendBooks = async (userId) => {
    const books = await Book.aggregate([
        // books and genres of the user
        {$lookup: { from: 'actions', localField: '_id', foreignField: 'book', as: 'actions' }},
        {$unwind: '$actions'},
        {$match : { 'actions.userId': userId }},
        {$unwind: '$genres'},
        {$group: { _id: '$actions.userId', userBooks: { $addToSet: '$_id' }, userGenres: { $addToSet: '$genres' } }},
        // other users that ordered books of the user
        {$lookup: {
            from: 'actions',
            let: { userBooks: '$userBooks', userId: '$_id' },
            pipeline: [
                {$match: {$expr: { $and: [
                    {$in: ['$book', '$$userBooks']},
                    {$ne: ['$userId', '$$userId']}
                ]}}},
                {$group: { _id: 1, ids: { $addToSet: '$userId' } }},
                {$project: { _id: 0, ids: 1 }}
            ],
            as: 'otherUser'
        }},
        {$unwind: '$otherUser'},
        // other books with the same genres of users that ordered books of the user
        {$lookup: {
            from: 'actions',
            let: { userBooks: '$userBooks', userGenres: '$userGenres', otherUser: '$otherUser.ids' },
            pipeline: [
                {$match: {$expr: {$and: [
                    {$not: {$in: ['$book', '$$userBooks']}},
                    {$in: ['$userId', '$$otherUser']}
                ]}}},
                {$lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'book' }},
                {$unwind: '$book'},
                {$project: { _id: 0, book: 1 }},
            ],
            as: 'recommendation'
        }},
        {$unwind: '$recommendation'},
        {$match: {$expr: {$gt: [{$size: {$setIntersection: ['$recommendation.book.genres', '$userGenres']}}, 0]}}},
        {$project: {
            _id: '$recommendation.book._id',
            title: '$recommendation.book.title',
            author: '$recommendation.book.author',
            genres: '$recommendation.book.genres'
        }}
    ]);

    return books.map(bookObj => Book.hydrate(bookObj));
}

export const getSortedBooks = async (sortBy) => {
    return Book.find().sort({ [sortBy]: -1 });
};
