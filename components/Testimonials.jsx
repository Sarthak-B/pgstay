import "../styles/testimonials.css"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Kumar",
      college: "Delhi University",
      text: "PGStay made finding my room so easy! The verification process was quick and the property owners were very responsive.",
      rating: 5,
      avatar: "👩‍🎓",
    },
    {
      name: "Rahul Singh",
      college: "IIT Delhi",
      text: "Great platform! No hidden charges, transparent pricing, and the virtual tours really helped me decide without visiting.",
      rating: 5,
      avatar: "👨‍🎓",
    },
    {
      name: "Anjali Patel",
      college: "BITS Pilani",
      text: "Finally found a hassle-free way to book my accommodation. PGStay is definitely the best student housing platform.",
      rating: 5,
      avatar: "👩‍🎓",
    },
  ]

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Student Reviews</p>
          <h2>What Students Say About Us</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="stars">
                {Array(testimonial.rating)
                  .fill("⭐")
                  .map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-college">{testimonial.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
