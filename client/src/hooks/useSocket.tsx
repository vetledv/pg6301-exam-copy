import { useEffect, useRef } from 'react'

const useSocket = (deps: any[] = [], callback: () => void) => {
    const socket = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!socket.current) return
        socket.current = new WebSocket(
            window.location.origin.replace(/^http/, 'ws')
        )

        socket.current.onopen = () => {
            console.log('socket opened')
        }
        socket.current.onclose = () => {
            console.log('socket closed')
        }
        socket.current.onerror = (e) => {
            console.log('socket error', e)
        }
        socket.current.onmessage = (event) => {
            console.log('deeznits')
            callback()
        }
    }, [...deps])

    return { socket }
}

export default useSocket
