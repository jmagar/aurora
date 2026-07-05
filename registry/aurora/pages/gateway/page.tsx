import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/registry/aurora/ui/card"
import { Timeline, TimelineItem } from "@/registry/aurora/ui/timeline"

export default function AuroraGatewayPage() {
  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="aurora-text-eyebrow">Aurora starter</p>
              <h1 className="aurora-text-display-2">Gateway operations</h1>
            </div>
            <Button variant="aurora">Run health check</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Connected tools", "42"],
              ["Queued jobs", "8"],
              ["Warnings", "2"],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardHeader>
                  <CardTitle>{value}</CardTitle>
                  <CardDescription>{label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent gateway events</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-3 px-6 pb-6">
            <Badge tone="success">All systems nominal</Badge>
            <Timeline>
              <TimelineItem tone="online" title="Registry smoke passed">
                aurora-base installed cleanly.
              </TimelineItem>
              <TimelineItem tone="online" title="Gateway sync complete">
                42 upstream tools available.
              </TimelineItem>
            </Timeline>
          </div>
        </Card>
      </div>
    </main>
  )
}
