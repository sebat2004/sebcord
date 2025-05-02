import { Link } from 'react-router'
import { Button } from './ui/button'

export const LoginButton = () => {
    return (
        <Button asChild>
            <Link to="/login">Login</Link>
        </Button>
    )
}

export const LogoutButton = () => {
    return (
        <Button asChild>
            <Link to="/logout">Logout</Link>
        </Button>
    )
}
