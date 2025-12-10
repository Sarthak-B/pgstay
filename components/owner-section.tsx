import { CheckCircle2, Building2, CreditCard, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: Users,
    title: "Verified Student Tenants",
    description: "All students verified with college ID",
  },
  {
    icon: CreditCard,
    title: "Auto-Rent Collection",
    description: "Automated monthly rent reminders & collection",
  },
  {
    icon: BarChart3,
    title: "Vacancy Management",
    description: "Track occupancy and manage listings easily",
  },
]

export default function OwnerSection() {
  return (
    <section className="bg-secondary py-16 lg:py-24" id="list">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card shadow-xl">
              <img
                src="/property-owner-managing-rental-property-on-laptop-.jpg"
                alt="Property owner managing listings"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -bottom-6 -right-6 lg:right-8 bg-card rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Active Owners</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              For Property Owners
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-6">
              Are you a Property Owner?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              List your PG or rental rooms on PGStay and connect with thousands of verified students looking for
              accommodation near their campus.
            </p>

            {/* Benefits List */}
            <div className="space-y-6 mb-10">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
                asChild
              >
                <a href="/owner/onboarding">List Your Property</a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 border-foreground text-foreground hover:bg-foreground hover:text-background text-base font-medium bg-transparent"
                asChild
              >
                <a href="#learn-more">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
