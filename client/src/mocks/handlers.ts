import { rest } from 'msw'
import { testArticle, testUser } from '../../jest.setup'

export const handlers = [
    rest.get('/api/login', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ ...testUser }))
    }),
    rest.delete('/api/login', (req, res, ctx) => {
        return res(ctx.status(200))
    }),
    rest.get('/api/articles', (req, res, ctx) => {
        const page = req.url.searchParams.get('page')
        if (page) {
            return res(
                ctx.status(200),
                ctx.json({
                    articles: [{ ...testArticle }],
                    totalPages: 1,
                    totalArticles: 1,
                })
            )
        } else {
            return res(ctx.status(200), ctx.json([{ testArticle }]))
        }
    }),

    rest.get('/api/articles/:id', (req, res, ctx) => {
        if (req.params.id === '69') {
            return res(ctx.status(200), ctx.json({ ...testArticle }))
        } else {
            throw new Error('Article not found')
        }
    }),
    rest.get('/api/articles/topic/:topic', (req, res, ctx) => {
        if (req.params.topic === 'news') {
            return res(ctx.status(200), ctx.json([{ ...testArticle }]))
        } else {
            throw new Error('Article not found')
        }
    }),
    rest.post('/api/articles/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ ...testArticle }))
    }),
]
