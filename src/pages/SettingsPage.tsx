import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { BillingSettings } from "@/components/settings/BillingSettings"
export function SettingsPage() {
  return (
    <main className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-display font-bold text-white">Settings</h1>
        <p className="text-lg text-zinc-400">
          Manage your account, profile, and billing information.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            Billing & Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </main>
  )
}