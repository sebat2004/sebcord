export default function ProfilePic({ username, size = 8 }: { username: string; size?: number }) {
    return (
        <div
            className={`flex items-center justify-center w-${size} h-${size} rounded-full bg-gray-200`}
        >
            <h3 className="text-lg font-semibold text-gray-700">
                {username && username?.charAt(0).toUpperCase()}
            </h3>
        </div>
    )
}
