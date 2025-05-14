import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { DialogHeader } from './ui/dialog'
import { Button } from './ui/button'
import { useCallStore } from '@/stores/useCallStore'

export const AcceptCallDialog = () => {
    const { incomingCall, accept, decline } = useCallStore()

    return (
        <Dialog open={!!incomingCall}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Incoming Call</DialogTitle>
                    <DialogDescription>From {incomingCall?.callerId}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => decline()}>
                        Decline
                    </Button>
                    <Button onClick={() => accept()}>Accept</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
