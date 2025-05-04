import { useAuthenticated } from '@/hooks/mutations'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

type ProtectedRouteProps = {
    redirectPath?: string
}

const ProtectedRoute = ({ redirectPath = '/' }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const { mutate, isError, isSuccess } = useAuthenticated()

    useEffect(() => {
        mutate()
    }, [])

    if (isError) {
        navigate(redirectPath)
    } else if (isSuccess) {
        return <Outlet />
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-xl">Loading...</h1>
        </div>
    )
}

export default ProtectedRoute
