import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dot, UsersRound } from 'lucide-react'
import { AddFriendSearchMenu, FriendsSearchMenu } from '@/components/commands'

export default function FriendsPage() {
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    return (
        <>
            <div className="flex items-center justify-start gap-2 p-4 border-b-1">
                <div className="flex items-center justify-center gap-2">
                    <UsersRound size={16} />
                    <h3 className="text-md font-medium">Friends</h3>
                </div>
                <Dot />
                <Button variant="secondary" size="sm" className="ml-auto">
                    Online
                </Button>
                <Button variant="secondary" size="sm" className="ml-auto">
                    All
                </Button>
                <Button variant="secondary" size="sm" className="ml-auto">
                    Pending
                </Button>
                <Dot />
                <Button size="sm" className="ml-auto" onClick={() => setAddDialogOpen(true)}>
                    Add Friend
                </Button>
            </div>
            <div className="flex items-start gap-3 h-full">
                <div className="flex flex-col gap-3 p-4 w-full lg:w-[75%]">
                    <FriendsSearchMenu />
                    <AddFriendSearchMenu open={addDialogOpen} setOpen={setAddDialogOpen} />
                </div>
                <div className="hidden lg:flex flex-col gap-3 h-full w-92 border-l-1 p-4 px-6">
                    <h1 className="text-xl font-semibold">Active Now</h1>
                    <ScrollArea className="flex flex-col gap-4">
                        <Card className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/avatars/1.jpg" />
                                <AvatarFallback>J</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <h2 className="text-md font-medium">Javi</h2>
                                <p className="text-sm text-muted-foreground">Google - 9hrs</p>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/avatars/1.jpg" />
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <h2 className="text-md font-medium">Sebat</h2>
                                <p className="text-sm text-muted-foreground">
                                    Fortnite Battle Royale - 48hrs
                                </p>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/avatars/1.jpg" />
                                <AvatarFallback>J</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <h2 className="text-md font-medium">J Doe</h2>
                                <p className="text-sm text-muted-foreground">NBA 2K25 - 24m</p>
                            </div>
                        </Card>
                    </ScrollArea>
                </div>
            </div>
        </>
    )
}
