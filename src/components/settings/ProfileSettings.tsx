import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/components/ui/sonner"
export function ProfileSettings() {
  const user = useAuth((state) => state.user)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile updated successfully!", {
      description: "Your changes have been saved.",
    })
  }
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name} className="bg-zinc-950 border-zinc-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} className="bg-zinc-950 border-zinc-700" />
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 px-6 py-4">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  )
}