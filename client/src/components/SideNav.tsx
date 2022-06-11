import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllArticles } from '../hooks/reactQueryHooks'

export const SideNav: FC = () => {
    const navigate = useNavigate()
    const articles = useAllArticles()
    const topicSize = (topic: string) => {
        const topics = articles.data?.map((article) => article.topic)
        const topicAmount = topics?.filter((_topic) => _topic === topic).length
        return topicAmount as number
    }
    useEffect(() => {
        const socket = new WebSocket(
            window.location.origin.replace(/^http/, 'ws')
        )
        socket.onmessage = (event) => {
            console.log(event.data)
            articles.refetch()
        }
    }, [])

    return (
        <div className='fixed bg-secondary px-4 top-20 h-screen w-80 hidden lg:block'>
            <div className='flex flex-col gap-2 p-2 w-full rounded-sm'>
                <div>Topics</div>
                <div>
                    <div className='px-4 pt-2 pb-4 w-full flex flex-wrap gap-2 border-b border-b-black border-opacity-25'>
                        <TopicButton
                            topic='news'
                            amount={topicSize('News')}></TopicButton>
                        <TopicButton
                            topic='sports'
                            amount={topicSize('Sports')}></TopicButton>
                        <TopicButton
                            topic='technology'
                            amount={topicSize('Technology')}></TopicButton>
                        <TopicButton
                            topic='entertainment'
                            amount={topicSize('Entertainment')}></TopicButton>
                        <TopicButton
                            topic='other'
                            amount={topicSize('Other')}></TopicButton>
                    </div>
                </div>
            </div>
            <div
                className='flex flex-col gap-2 p-2 w-full rounded-md bg-cyan-600 cursor-pointer text-contrast dark:text-primary'
                onClick={() => navigate('/')}>
                All articles
            </div>
        </div>
    )
}

const TopicButton = ({ topic, amount }: { topic: string; amount: number }) => {
    const navigate = useNavigate()
    return (
        <div
            className='px-4 py-2 w-fit bg-cyan-600 hover:bg-cyan-700 cursor-pointer rounded-md text-contrast dark:text-primary'
            onClick={() => navigate('/articles/topic/' + topic)}>
            {topic.charAt(0).toUpperCase() + topic.slice(1)}({amount})
        </div>
    )
}
