import { useEffect } from 'react'
import { useAuthenticated } from '@/mutations'

function HomePage(): JSX.Element {
    const { data, mutate } = useAuthenticated()

    useEffect(() => {
        mutate()
    }, [])

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl">Welcome to the Home page!</h1>
            <p className="text-gray-500">You are {data ? 'authenticated' : 'not authenticated'}</p>
        </main>
    )
}

export default HomePage
