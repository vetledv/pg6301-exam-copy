import { rest } from 'msw'
import { testArticle, testUser } from '../../jest.setup'

export const handlers = [
    rest.get('/api/login', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ ...testUser }))
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
        return res(ctx.status(200), ctx.json({ ...testArticle }))
    }),
    rest.get('/api/articles/topic/:topic', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([{ ...testArticle }]))
    }),
    rest.post('/api/articles', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ ...testArticle }))
    }),
]
