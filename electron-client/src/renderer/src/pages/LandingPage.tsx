import { useEffect } from 'react'
import { useAuthenticated } from '@/mutations'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

function LandingPage(): JSX.Element {
    const { mutate, data } = useAuthenticated()

    useEffect(() => {
        mutate()
        console.log('data fetching')
    }, [])

    return (
        <main>
            <h1 className="text-xl">Hello, Discord Clone!</h1>
            <p className="text-gray-500">You are {data ? 'authenticated' : 'not authenticated'}</p>
            {data ? (
                <Button asChild>
                    <Link to="/home">Get Started</Link>
                </Button>
            ) : (
                <Button asChild>
                    <Link to="/login">Login</Link>
                </Button>
            )}
        </main>
    )
}

export default LandingPage
