import "../styles/features.css"

const Features = () => {
  const features = [
    {
      icon: "✓",
      title: "Verified Properties",
      description: "All PG accommodations are verified and checked for authenticity by our team.",
    },
    {
      icon: "📸",
      title: "360° Virtual Tours",
      description: "Explore rooms with high-quality photos and virtual tours before booking.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description: "Chat directly with property owners without any middleman or commissions.",
    },
    {
      icon: "🔒",
      title: "Safe & Secure",
      description: "Your data is protected with industry-leading encryption and security protocols.",
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Book your room instantly with transparent pricing and no hidden charges.",
    },
    {
      icon: "🌟",
      title: "Reviews & Ratings",
      description: "Read authentic reviews from verified students who have lived in these rooms.",
    },
  ]

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Why Choose Us</p>
          <h2>Everything Students Need</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
