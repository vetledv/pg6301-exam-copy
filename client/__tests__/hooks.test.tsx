import { renderHook } from '@testing-library/react-hooks'
import { useAllArticles, useArticle } from '../src/hooks/reactQueryHooks'
import { createWrapper } from './client.test'

describe('custom hooks', () => {
    test('useAllArticles', async () => {
        const { result, waitFor } = renderHook(() => useAllArticles(), {
            wrapper: createWrapper(),
        })
        await waitFor(() => {
            return result.current.isSuccess
        })
        expect(result.current.isSuccess).toBe(true)
    })
    test('useArticle', async () => {
        const { result, waitFor } = renderHook(() => useArticle('69'), {
            wrapper: createWrapper(),
        })
        await waitFor(() => {
            return result.current.isSuccess
        })
        expect(result.current.isSuccess).toBe(true)
    })
})
