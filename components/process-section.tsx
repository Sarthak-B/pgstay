import { Award as IdCard, View, MessageCircle } from "lucide-react"

const steps = [
  {
    icon: IdCard,
    title: "Verify Identity",
    description: "Upload your college ID for instant verification. We ensure only genuine students join the platform.",
    step: "01",
  },
  {
    icon: View,
    title: "Virtual Tour",
    description: "Check 360° views and detailed photos of rooms before visiting. Save time with virtual walkthroughs.",
    step: "02",
  },
  {
    icon: MessageCircle,
    title: "Book Directly",
    description: "Chat with property owners, negotiate rent, and book your room directly without any middleman.",
    step: "03",
  },
]

export default function ProcessSection() {
  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Move-in made simple.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-6 w-12 border-t-2 border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
