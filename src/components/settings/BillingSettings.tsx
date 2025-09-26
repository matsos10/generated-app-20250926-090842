import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth, Plan } from "@/hooks/useAuth"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/sonner"
const plans: { id: Plan; name: string; price: string; features: string[]; popular?: boolean }[] = [
  { id: "Free", name: "Free", price: "$0", features: ["1 Video per month", "Basic AI Voice", "Watermarked Videos"] },
  { id: "Pro", name: "Pro", price: "$29", popular: true, features: ["20 Videos per month", "Premium AI Voices", "No Watermark", "1080p Resolution"] },
  { id: "Team", name: "Team", price: "$79", features: ["Unlimited Videos", "All Pro features", "Team Collaboration", "Priority Support"] },
];
export function BillingSettings() {
  const { user, changePlan } = useAuth();
  const plan = user?.plan;
  const handlePlanChange = (newPlan: Plan) => {
    changePlan(newPlan);
    toast.success(`Plan changed to ${newPlan}!`, {
      description: "Your subscription has been updated.",
    });
  };
  const currentPlanDetails = plans.find(p => p.id === plan);
  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the <span className="font-semibold text-indigo-400">{currentPlanDetails?.name}</span> plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p>Videos this month</p>
                <p className="text-zinc-400">0 / {plan === 'Free' ? '1' : plan === 'Pro' ? '20' : 'Unlimited'}</p>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 px-6 py-4 flex justify-end">
          <Button variant="destructive" onClick={() => handlePlanChange('Free')}>Cancel Subscription</Button>
        </CardFooter>
      </Card>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-white">Manage Subscription</h3>
        <p className="text-zinc-400">Choose a plan that works for you.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className={cn("bg-zinc-900 border-zinc-800 flex flex-col", plan === p.id && "border-indigo-500/50 ring-2 ring-indigo-500/50")}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <p className="text-3xl font-bold">{p.price}<span className="text-base font-medium text-zinc-400">/mo</span></p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan === p.id ? (
                <Button disabled className="w-full bg-zinc-800">Current Plan</Button>
              ) : (
                <Button onClick={() => handlePlanChange(p.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  {plan === 'Free' ? 'Upgrade' : p.id === 'Free' ? 'Downgrade' : 'Switch Plan'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}