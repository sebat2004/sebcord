import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { useGetAuthenticated } from '@/hooks/queries'

function LandingPage(): JSX.Element {
    const { isSuccess } = useGetAuthenticated()

    return (
        <section>
            <h1 className="text-xl">Hello, Discord Clone!</h1>
            <p className="text-gray-500">
                You are {isSuccess ? 'authenticated' : 'not authenticated'}
            </p>
            {isSuccess ? (
                <Button asChild>
                    <Link to="/home">Get Started</Link>
                </Button>
            ) : (
                <Button asChild>
                    <Link to="/login">Login</Link>
                </Button>
            )}
        </section>
    )
}

export default LandingPage
