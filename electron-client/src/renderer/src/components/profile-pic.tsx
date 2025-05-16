export default function ProfilePic({ username, size }: { username: string; size?: number }) {
    if (!size) size = 8 // default size
    const style = {
        width: `w-${size}`,
        height: `h-${size}`
    }

    return (
        <div
            className={`flex items-center justify-center ${style.width} ${style.height} rounded-full bg-gray-200 outline-1`}
        >
            <h3 className="text-lg font-semibold text-gray-700">
                {username && username?.charAt(0).toUpperCase()}
            </h3>
        </div>
    )
}
