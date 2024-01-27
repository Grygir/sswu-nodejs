// 1. Вивести середній вік користувачів за країною
db.users.aggregate([
    {$group: {_id: '$address.country' , age: {$avg: '$age'}}}
]);

// 2. Порахувати кількість користувачів за кожною улюбленою квіткою
db.users.aggregate([
    {$group: {_id: '$preferences.flower' , usersCount: {$count: {}}}}
]);

// 3. Вивести кількість користувачів з прізвищем Kuzmenko
db.users.aggregate([
    {$match: {lastName: 'Kuzmenko'}},
    {$group: {_id: '$lastName' , usersCount: {$count: {}}}}
]);

// 4. Отримати топ-3 найпопулярніших навичок серед користувачів та вивести кількість користувачів,
// які володіють кожною з них
db.users.aggregate([
    {$match: {skills: {$ne: null}}},
    {$unwind: '$skills'},
    {$group: {_id: '$skills' , skillsCount: {$count: {}}}},
    {$sort: {skillsCount: -1}},
    {$limit: 3}
]);

// 5. Створити рейтинг міст за кількістю користувачів, які в ньому проживають
db.users.aggregate([
    {$group: {_id: '$address.city' , usersCount: {$count: {}}}},
    {$sort: {usersCount: -1}}
]);

// 6. Порахувати загальну кількість домашніх тварин у всіх користувачів
db.users.aggregate([
    {$match: {pets: {$ne: null}}},
    {$group: {_id: 1, totalPets: {$sum: {$size: '$pets'}}}},
]);

// 7. Вивести користувачів, які живуть у Ванкувері та володіють JavaScript.
// Вивести їх імʼя, прізвище, вік та список навичок
db.users.aggregate([
    {$match: {'address.city': 'Vancouver', skills: 'JavaScript'}},
    {$project: {_id: 0, firstName: 1, lastName: 1, age: 1, skills: 1}}
]);

// 8. Знайти усіх користувачів, які люблять каву та живуть у Львові.
// Вивести їх імʼя, прізвище, місто проживання, вік, улюблений напій та колір.
// Відсортувати за віком від молодших до старших
db.users.aggregate([
    {$match: {
        'preferences.drink': 'coffee',
        'address.city': 'Lviv'
    }},
    {$project:
        {_id: 0, firstName: 1, lastName: 1, 'address.city': 1, age: 1, 'preferences.drink': 1, 'preferences.color': 1}
    },
    {$sort: {age: 1}}
]);

// 9. Отримати список користувачів які не люблять жовтий або червоний колір. Вивести їх імʼя, прізвище та адресу
db.users.aggregate([
    {$match: {'preferences.color': {$nin: ['yellow', 'black']}}},
    {$project: {_id: 0, firstName: 1, lastName: 1, address: 1}}
]);

// 10.* Розділити користувачів на 3 групи за кількістю навичок:
// beginner (0-1 навичок ),
// intermediate (2 навички),
// expert (3 та більше навичок).
// Вивести їх імʼя, прізвище та навички якими вони володіють
db.users.aggregate([
    {$project: {
        _id: 0,
        firstName: 1,
        lastName: 1,
        skills: 1,
        skillsSize: {$cond: {if: {$isArray: '$skills'}, then: {$size: '$skills'}, else: 0}}
    }},
    {$group: {
        _id: {
            $cond: {
                if: {$lte: ['$skillsSize', 1]},
                then: 'beginner',
                else: {
                    $cond: {
                        if: {$eq: ['$skillsSize', 2]},
                        then: 'intermediate',
                        else: 'expert'
                    }
                }
            }
        },
        users: {$push: {firstName: '$firstName', lastName: '$lastName', skills: '$skills'}}
    }}
]);
