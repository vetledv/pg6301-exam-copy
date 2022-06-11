import express from 'express'
import { Db, ObjectId } from 'mongodb'

export interface Article {
    _id?: ObjectId
    author: string
    body: string
    date: Date
    headline: string
    sub: string
    topic: string
}

export const ArticleRouter = (db: Db) => {
    const router = express.Router()

    router.get('/', async (req, res) => {
        const { page } = req.query as { page: string }
        if (page) {
            const offset = (parseInt(page) - 1) * 10

            const totalArticles = await db
                .collection('articles')
                .countDocuments()

            const articleslimit = await db
                .collection('articles')
                .find()
                .sort({ _id: -1 })
                .skip(offset)
                .limit(10)
                .map(
                    ({ _id, author, body, date, headline, sub, topic }) =>
                        ({
                            _id,
                            author,
                            body,
                            date,
                            headline,
                            sub,
                            topic,
                        } as Article)
                )
                .toArray()
            const next =
                parseInt(page) * 10 < totalArticles ? parseInt(page) + 1 : null
            res.status(200).json({
                articles: articleslimit,
                next,
            })
        } else {
            const articles = await db
                .collection('articles')
                .find()
                .sort({ _id: -1 })
                .map(
                    ({ _id, author, body, date, headline, sub, topic }) =>
                        ({
                            _id,
                            author,
                            body,
                            date,
                            headline,
                            sub,
                            topic,
                        } as Article)
                )
                .toArray()
            res.status(200).json(articles)
        }
    })

    router.post('/', async (req, res) => {
        const newArticle = req.body
        const article = await db
            .collection('articles')
            .findOne({ headline: req.body.headline })
        if (article) {
            res.status(400).send('Article already exists')
            return
        }
        await db.collection('articles').insertOne(newArticle)
        res.sendStatus(201)
    })

    router.get('/topic/:topic', async (req, res) => {
        const topic = req.params.topic
        const uTopic = topic?.charAt(0).toUpperCase() + topic?.slice(1)
        const articles = await db
            .collection('articles')
            .find({ topic: uTopic })
            .map(
                ({ _id, author, body, date, headline, sub, topic }) =>
                    ({
                        _id,
                        author,
                        body,
                        date,
                        headline,
                        sub,
                        topic,
                    } as Article)
            )
            .toArray()
        res.json(articles)
    })

    router.get('/:id', async (req, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send('Invalid id')
            return
        }
        const article = await db
            .collection('articles')
            .findOne({ _id: new ObjectId(req.params.id) })
        res.json(article)
    })

    router.put('/:id', async (req, res) => {
        const article = req.body
        await db
            .collection('articles')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: article })

        res.sendStatus(200)
    })

    return router
}
