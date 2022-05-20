import { useState, useEffect } from 'react'
import { useServices } from '../services'

const readyStateReadable: Record<string, string> = {
    '0': 'Connecting',
    '1': 'Connected',
    '2': 'Disconnecting',
    '3': 'Disconnected',
}

export function useReadyState () {
    const { WebsocketService } = useServices()
    const [readyState, setReadyState] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setReadyState(WebsocketService.ws.readyState)
        }, 500)
    
        return () => clearInterval(interval)
    }, [])
    
    return readyStateReadable[readyState]
}