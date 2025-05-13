import { useGetAuthenticated } from '@/hooks/queries'
import { useUserStore } from '@/store'
import { Outlet, useNavigate } from 'react-router'

type ProtectedRouteProps = {
    redirectPath?: string
}

const ProtectedRoute = ({ redirectPath = '/' }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const { isError, isSuccess } = useGetAuthenticated()

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
