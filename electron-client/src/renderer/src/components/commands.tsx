import {
    Check,
    EllipsisVertical,
    MessageCircle,
    Option,
    OptionIcon,
    Plus,
    Send
} from 'lucide-react'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from '@/components/ui/command'
import { Skeleton } from './ui/skeleton'
import ProfilePic from './profile-pic'

import { useGetFriends, useGetSentFriendRequests, useSearchUsers } from '@/hooks/queries'
import { useAddFriend } from '@/hooks/mutations'
import { User } from '@/types'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useUserStore } from '@/store'
import { Link } from 'react-router'

export function FriendsSearchMenu() {
    const { data: friendsData } = useGetFriends()

    return (
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandGroup heading="Online">
                    {friendsData ? (
                        friendsData.map((friend) => {
                            return (
                                <CommandItem
                                    className="flex justify-between items-center px-2"
                                    value={friend.username}
                                    key={friend.id}
                                >
                                    <div className="flex items-center gap-2">
                                        <ProfilePic username={friend.username} size={10} />
                                        <p>{friend.username}</p>
                                        <p>{friend.active}</p>
                                    </div>

                                    <CommandShortcut className="flex items-center gap-2">
                                        <Link to={`/home/message/${friend.id}`}>
                                            <MessageCircle color="black" size={16} />
                                        </Link>
                                        <EllipsisVertical color="black" size={16} />
                                    </CommandShortcut>
                                </CommandItem>
                            )
                        })
                    ) : (
                        <Skeleton className="h-6 w-full" />
                    )}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Offline">
                    {friendsData ? (
                        friendsData.map((friend) => {
                            if (friend.active)
                                return (
                                    <CommandItem
                                        className="flex justify-between items-center px-2"
                                        key={friend.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ProfilePic username={friend.username} size={10} />
                                            <p>{friend.username}</p>
                                        </div>

                                        <CommandShortcut>
                                            <MessageCircle size={16} />
                                        </CommandShortcut>
                                    </CommandItem>
                                )
                            return null
                        })
                    ) : (
                        <Skeleton className="h-6 w-full" />
                    )}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

export const AddFriendSearchMenu = ({
    open,
    setOpen
}: {
    open: boolean
    setOpen: (open: boolean) => void
}) => {
    const [friendSearch, setFriendSearch] = useState<string | undefined>(undefined)
    const [value] = useDebounce(friendSearch, 400)
    const { data: searchData } = useSearchUsers(value)
    const { data: sentFriendRequestData } = useGetSentFriendRequests()
    const { mutate: addFriend } = useAddFriend()
    const { user: authenticatedUser } = useUserStore()
    const { data: friendsData } = useGetFriends()

    const sentFriendRequestIds = sentFriendRequestData?.map((user: User) => user.id) || []
    const sentFriendRequestsSet = new Set(sentFriendRequestIds || [])
    const friendIds = friendsData?.map((user: User) => user.id) || []
    const friendSet = new Set(friendIds || [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                value={friendSearch}
                onValueChange={(v) => setFriendSearch(v)}
                placeholder="Search for a user..."
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {searchData?.map((user) => {
                        if (user.id === authenticatedUser?.id) return null

                        return (
                            <CommandItem
                                className="flex justify-between items-center"
                                key={user.id}
                                value={user.username}
                                onSelect={() => {
                                    addFriend(user.id)
                                    setOpen(false)
                                }}
                                disabled={
                                    sentFriendRequestsSet.has(user.id) || friendSet.has(user.id)
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <ProfilePic username={user.username} size={10} />
                                    <p>{user.username}</p>
                                </div>

                                <CommandShortcut>
                                    {sentFriendRequestsSet.has(user.id) ? (
                                        <div className="flex items-center gap-2">
                                            <Send size={16} />
                                            <p className="text-xs">Request Sent</p>
                                        </div>
                                    ) : friendSet.has(user.id) ? (
                                        <div className="flex items-center gap-2">
                                            <Check size={16} />
                                            <p className="text-xs">Added</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Plus size={16} />
                                            <p className="text-xs">Add Friend</p>
                                        </div>
                                    )}
                                </CommandShortcut>
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
