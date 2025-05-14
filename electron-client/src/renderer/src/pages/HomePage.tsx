import { useGetAuthenticated } from '@/hooks/queries'

export default function HomePage(): JSX.Element {
    const { data: auth } = useGetAuthenticated()

    if (!auth?.user) {
        return <div>Loading...</div>
    }

    return (
        <section className="flex flex-col items-center justify-center h-screen space-y-6">
            <h1 className="text-xl">Hello, {auth.user.username}</h1>
        </section>
    )
}
