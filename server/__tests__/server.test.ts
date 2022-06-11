import dotenv from 'dotenv'
import request from 'supertest'
import { app, mongoClient } from '../src/app'
import { Article, ArticleRouter } from '../src/ArticleRouter'

dotenv.config()

beforeAll(async () => {
    await mongoClient.connect()
    const db = mongoClient.db('test_articles')
    await db.collection('articles').deleteMany({})
    app.use('/api/articles', ArticleRouter(db))
})
beforeEach(async () => {
    await mongoClient.db('test_articles').collection('articles').deleteMany({})
})

afterAll(async () => {
    await mongoClient.close()
})
const testArticle: Article = {
    author: 'Vetle Brandth',
    body: 'Hello World',
    date: new Date('2022-05-06'),
    headline: 'Hello World',
    sub: 'dsrftygjuhrfty',
    topic: 'News',
}

describe('articles api', () => {
    test('add article and get articles to compare', async () => {
        await request(app).post('/api/articles').send(testArticle).expect(201)
        expect(
            (
                await request(app)
                    .get('/api/articles')
                    .query({ author: testArticle.author })
                    .expect(200)
            ).body.map(({ author }: { author: string }) => author)
        ).toContain(testArticle.author)
    })
    test('add article 404 exists', async () => {
        await request(app).post('/api/articles').send(testArticle).expect(201)
        await request(app).post('/api/articles').send(testArticle).expect(400)
    })

    test('get articles by id', async () => {
        await request(app).post('/api/articles').send(testArticle).expect(201)
        const res = await request(app).get('/api/articles').expect(200)
        expect(
            (
                await request(app)
                    .get(`/api/articles/${res.body[0]._id}`)
                    .expect(200)
            ).body
        ).toEqual(res.body[0])
    })
    test('get articles by topic', async () => {
        await request(app).post('/api/articles').send(testArticle).expect(201)
        const res = await request(app).get('/api/articles').expect(200)
        expect(
            (
                await request(app)
                    .get(`/api/articles/topic/${testArticle.topic}`)
                    .expect(200)
            ).body
        ).toEqual(
            res.body.filter(
                ({ topic }: { topic: string }) => topic === testArticle.topic
            )
        )
    })
})
