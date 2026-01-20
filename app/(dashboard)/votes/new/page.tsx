
import { getUserProfile } from '@/lib/data/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPoll } from '../actions'
import { redirect } from 'next/navigation'

export default async function NewVotePage() {
    const profile = await getUserProfile()
    if (profile?.role !== 'president') {
        redirect('/votes')
    }

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Poll</CardTitle>
                    <CardDescription>Set up a vote for the group.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createPoll} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input name="title" required placeholder="e.g. Purchase new Sofa" />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input name="description" placeholder="Details..." />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="is_anonymous" id="anon" className="h-4 w-4" />
                            <Label htmlFor="anon">Anonymous Vote?</Label>
                        </div>

                        <div className="space-y-2">
                            <Label>Options (comma separated)</Label>
                            <Input name="options" required placeholder="Yes, No, Maybe" />
                        </div>

                        <Button type="submit" className="w-full">Create Poll</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
