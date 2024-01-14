import supertest from 'supertest';
import app from '../../src/app';
import config from '../../src/config/server.config.js';

describe('/api/books', () => {
    let server;

    beforeEach(() => {
        server = supertest(app);
    });

    describe('GET /api/books', () => {
        it('should be successful', async () => {
            const res = await server.get('/api/books');
            expect(res.status).toBe(200);
        });

        it('should return list of books', async () => {
            const res = await server.get('/api/books');
            expect(res.body).toMatchObject({
                books: [
                    expect.objectContaining({
                        id: expect.any(String),
                        title: expect.any(String),
                        author: expect.any(String),
                        price: expect.any(Number),
                    }),
                    expect.objectContaining({
                        id: expect.any(String),
                        title: expect.any(String),
                        author: expect.any(String),
                        price: expect.any(Number),
                    })
                ],
                booksCount: 2
            });
        });

        describe('Broken storage file', () => {
            let dataFile;
            beforeEach(() => {
                dataFile = config.DATA_FILE;
                config.DATA_FILE = './test.json';
            });

            it('should return "500 Internal server error"', async () => {
                const res = await server.get('/api/books');
                expect(res.status).toBe(500);
            });

            afterEach(() => {
                config.DATA_FILE = dataFile;
            });
        });
    });

    describe('POST /api/books', () => {
        it('should return 201 on post request', async () => {
            const res = await server.post('/api/books')
                .send({
                    title: "Le Petit Prince",
                    author: "Antoine de Saint-Exupéry",
                    price: 9.99
                })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(201);
        });

        it('should return created book with id', async () => {
            const res = await server.post('/api/books')
                .send({
                    title: "Le Petit Prince",
                    author: "Antoine de Saint-Exupéry",
                    price: 9.99
                })
                .set('Content-Type', 'application/json');

            expect(res.body).toEqual(    {
                id: expect.any(String),
                title: "Le Petit Prince",
                author: "Antoine de Saint-Exupéry",
                price: 9.99
            });
        });

        it('should return "400 Bad request" if price is not valid', async () => {
            const res = await server.post(`/api/books`)
                .send({
                    title: "Le Petit Prince",
                    author: "Antoine de Saint-Exupéry",
                    price: 0.1
                })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/books/{id}', () => {
        const bookID = '708b8f84-bd94-447d-91ff-3c8339a15859';

        it(`should return book with id "${bookID}"`, async () => {
            const res = await server.get(`/api/books/${bookID}`);
            expect(res.body).toEqual(    {
                id: "708b8f84-bd94-447d-91ff-3c8339a15859",
                title: "The Black Arrow",
                author: "Robert Louis Stevenson",
                price: 49.99,
                year: 2024,
                genres: [
                    "Historical",
                    "Adventure",
                    "Romance novel"
                ]
            });
        });

        it('should return "404 Not found" if the book does not exist', async () => {
            const res = await server.get(`/api/books/708b8f84-bd94-447d-91ff-3c8339a15850`);
            expect(res.status).toBe(404);
        });

        it('should return "400 Bad request" if id format is not correct', async () => {
            const res = await server.get(`/api/books/708b8f84-bd94-447d-91ff`);
            expect(res.status).toBe(400);
        });
    });

    describe('PATCH /api/books/{id}', () => {
        const bookID = '708b8f84-bd94-447d-91ff-3c8339a15859';

        it('should return 200 on book update request', async () => {
            const res = await server.patch(`/api/books/${bookID}`)
                .send({ price: 149.99 })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(200);
        });

        it('should return updated book data', async () => {
            const res = await server.patch(`/api/books/${bookID}`)
                .send({
                    price: 149.99,
                    year: null,
                    genres: null
                })
                .set('Content-Type', 'application/json');

            expect(res.body).toEqual({
                id: bookID,
                title: expect.any(String),
                author: expect.any(String),
                price: 149.99
            });
        });

        it('should return "400 Bad request" if content is not valid', async () => {
            const res = await server.patch(`/api/books/${bookID}`)
                .send({ price: 0.1 })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
        });

        it('should return "400 Bad request" if id format is not correct', async () => {
            const res = await server.patch('/api/books/708b8f84')
                .send({ price: 149.99 })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(400);
        });

        it('should return "404 Not found" if the book does not exist', async () => {
            const res = await server.patch('/api/books/708b8f84-bd94-447d-91ff-3c8339a15851')
                .send({ price: 149.99 })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/books/{id}', () => {
        const bookID = '708b8f84-bd94-447d-91ff-3c8339a15859';

        it(`should return 204 on delete book with id "${bookID}"`, async () => {
            const res = await server.delete(`/api/books/${bookID}`);
            expect(res.status).toBe(204);
        });

        it('should return "400 Bad request" if id format is not correct', async () => {
            const res = await server.delete('/api/books/708b8f84');
            expect(res.status).toBe(400);
        });

        it('should return "404 Not found" if the book does not exist', async () => {
            const res = await server.delete('/api/books/708b8f84-bd94-447d-91ff-3c8339a15851');
            expect(res.status).toBe(404);
        });
    });
});
