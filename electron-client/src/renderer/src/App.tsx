import { useEffect, useState } from 'react'
import LoginButton from './components/buttons'

function App(): JSX.Element {
    const [response, setResponse] = useState(null)

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5001')
            const data = await res.json()
            setResponse(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData()
        console.log('data fetching')
    }, [])

    return (
        <>
            <h1>Hello, Discord Clone!</h1>
            {response ? (
                <div>
                    <h2>Response from server:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <LoginButton />
        </>
    )
}

export default App
