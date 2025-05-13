import { useParams } from 'react-router'

const MessagePage = () => {
    const { id } = useParams()
    return <div>MessagePage to {id}</div>
}

export default MessagePage
