import "../styles/cta.css"

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content animate-fade-in-up">
          <h2>Ready to Find Your Perfect Room?</h2>
          <p>Join thousands of students who have found their ideal accommodation on PGStay.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">Start Searching</button>
            <button className="btn btn-secondary btn-large">List Your Property</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
