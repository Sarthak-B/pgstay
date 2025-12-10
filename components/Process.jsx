import "../styles/process.css"

const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up with your email and verify your college ID for instant verification.",
    },
    {
      number: "02",
      title: "Browse & Search",
      description: "Explore verified PG listings with detailed photos and virtual tours.",
    },
    {
      number: "03",
      title: "Connect",
      description: "Chat directly with property owners to ask questions and negotiate rates.",
    },
    {
      number: "04",
      title: "Book & Move",
      description: "Complete your booking and move in to your new student home.",
    },
  ]

  return (
    <section id="process" className="process">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Simple Process</p>
          <h2>Get Started in 4 Easy Steps</h2>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <div key={index} className="process-step animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
