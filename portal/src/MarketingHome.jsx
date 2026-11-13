import React from "react";

const packages = [
  {
    name: "Balance", price: "₹4,500", sessions: "6 individual sessions", validity: "2 weeks",
    line: "A beginning towards emotional clarity",
    about: "For people taking their first steps towards psychological support or seeking guidance with current emotional challenges. Explore present concerns, identify emotional triggers and begin developing healthier responses.",
    includes: [
      "Initial exploration of concerns and collaborative goal setting",
      "Understanding emotional triggers, thoughts and responses",
      "Practical coping and emotional regulation strategies",
      "Guided reflection exercises and relevant worksheets",
      "Personalised therapeutic direction based on initial sessions",
      "Progress check-in within the package"
    ],
    ideal: "Everyday stress, emotional overwhelm, anxiety, adjustment difficulties, relationship concerns or an introduction to professional therapy."
  },
  {
    name: "Evolve", price: "₹7,200", sessions: "12 individual sessions", validity: "4 weeks",
    line: "Understand your patterns. Create meaningful change.",
    about: "A structured therapeutic experience to understand emotional and behavioural patterns influencing everyday life. Identify recurring thoughts and underlying beliefs while developing healthier responses.",
    includes: [
      "Initial clinical screening and collaborative therapy goals",
      "Identification of recurring emotional and behavioural patterns",
      "CBT-informed interventions and cognitive restructuring, where appropriate",
      "Exploration of underlying beliefs and relationship patterns",
      "Personalised therapeutic worksheets and reflection exercises",
      "Emotional regulation and coping strategies",
      "Progress reviews and adjustment of goals as needed"
    ],
    ideal: "Anxiety, relationship difficulties, low self-esteem, emotional regulation challenges, career-related stress, negative thought patterns or boundary difficulties."
  },
  {
    name: "Transform", price: "₹12,000", sessions: "22 individual sessions", validity: "9 weeks",
    line: "Deeper understanding. Sustainable growth.",
    about: "Balenza's most comprehensive package for people seeking consistent and deeper psychological support. Explore longstanding emotional difficulties and work towards meaningful change at an individual pace.",
    includes: [
      "Detailed exploration of concerns and relevant personal history",
      "Individualised therapeutic roadmap and ongoing goal review",
      "Exploration of core beliefs and longstanding emotional patterns",
      "CBT and psychodynamic-informed interventions, as clinically appropriate",
      "Trauma-informed work where indicated and within scope of care",
      "Attachment, relationship and boundary exploration where relevant",
      "Emotional regulation and behavioural change strategies",
      "Personalised exercises, progress reviews and maintenance planning"
    ],
    ideal: "Longstanding emotional difficulties, childhood experiences, relationship and attachment concerns, trauma-related difficulties, persistent anxiety, self-esteem concerns or recurring behavioural patterns."
  }
];

const contactPhone = "+919690271414";
const whatsapp = "https://wa.me/919690271414";

function BrandMark() {
  return <span className="mk-mark" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M32 53V30c0-12 8-20 19-20-1 11-7 18-19 21M32 42C30 27 21 19 9 20c1 13 10 20 23 22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M32 52c-3-9-8-13-15-15m15 10c4-7 10-10 17-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="12" r="3" fill="#fff"/><circle cx="50" cy="8" r="3" fill="#fff"/></svg></span>;
}

export default function MarketingHome({ onPortalClick }) {
  return <div className="marketing-site">
    <div className="mk-topline">ONLINE PSYCHOLOGICAL THERAPY &amp; COUNSELLING · A SPACE TO BE HEARD</div>
    <header className="mk-header">
      <a className="mk-brand" href="#mk-home"><BrandMark/><span>BALENZA<small>THERAPY</small></span></a>
      <nav aria-label="Main navigation" className="mk-nav"><a href="#mk-approach">Our approach</a><a href="#mk-services">Services</a><a href="#mk-packages">Packages</a><a href="#mk-psychologist">Psychologist</a></nav>
      <button className="mk-portal-btn" onClick={onPortalClick}>Patient portal <span>↗</span></button>
    </header>

    <main id="mk-home">
      <section className="mk-hero">
        <div className="mk-container mk-hero-grid">
          <div className="mk-hero-copy">
            <span className="mk-eyebrow">TAKING CARE OF YOUR MENTAL HEALTH</span>
            <h1>Where healing<br/>is <em>human.</em></h1>
            <div className="mk-mantra">BALANCE <i>·</i> BOUNDARIES <i>·</i> BELONGING</div>
            <p>At Balenza Therapy, we believe that mental well-being begins with understanding yourself, your emotions and the patterns that shape your life. We offer a supportive, confidential and non-judgmental space to explore concerns, build healthier coping strategies and work towards meaningful emotional and behavioural change.</p>
            <div className="mk-actions"><a className="mk-btn" href="#mk-packages">Explore packages</a><a className="mk-btn mk-btn-light" href={whatsapp+"?text=Hello%20Balenza%20Therapy%2C%20I%27d%20like%20to%20enquire%20about%20therapy."} target="_blank" rel="noreferrer">WhatsApp enquiry ↗</a></div>
            <div className="mk-hero-caption">ONLINE INDIVIDUAL THERAPY · CHILDREN · ADOLESCENTS · ADULTS</div>
          </div>
          <div className="mk-logo-art">
            <div className="mk-logo-circle">
              <svg viewBox="0 0 300 300" role="img" aria-label="Botanical head silhouette representing Balenza Therapy">
                <path d="M82 236c-3-20 4-38 12-53-12-19-16-44-9-68 9-33 38-57 77-60 36-3 67 16 81 45 12 24 9 55-4 77-8 13-20 22-34 27l-5 32H82z" fill="#17231d"/>
                <path d="M105 151c20-34 35-48 58-59m-52 89c19-27 39-39 62-47m-53 69c19-22 42-32 69-37" stroke="#aebac0" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M161 91c12 9 22 18 31 32m-23-25c-7 13-9 24-8 36m26-22c12 4 20 11 27 22m-45 5c12-5 24-5 36-1m-55 22c15-7 28-8 43-4m-33 20c16-4 28-2 40 5" stroke="#8fae9a" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <g fill="#e5f0e5"><circle cx="190" cy="105" r="4"/><circle cx="207" cy="124" r="3"/><circle cx="174" cy="133" r="3"/><circle cx="221" cy="151" r="4"/><circle cx="195" cy="166" r="3"/><circle cx="164" cy="179" r="3"/><circle cx="211" cy="187" r="3"/></g>
                <path d="M202 93v12m-6-6h12m-9-4 6 8m0-8-6 8M229 137v12m-6-6h12m-9-4 6 8m0-8-6 8" stroke="#e5f0e5" strokeWidth="1.6" fill="none"/>
              </svg>
              <strong>BALENZA</strong><small>Therapy</small>
            </div>
            <span className="mk-logo-caption">Where healing is human.</span>
          </div>
        </div>
      </section>

      <section className="mk-section mk-approach" id="mk-approach">
        <div className="mk-container">
          <div className="mk-heading"><span className="mk-eyebrow">THE HEART OF BALENZA</span><h2>Care that honours your journey.</h2><p>A supportive, confidential and non-judgmental space for reflection, understanding and growth.</p></div>
          <div className="mk-values">
            <article><span>01</span><h3>Individualised care</h3><p>Therapy shaped around each person's needs, goals and pace.</p></article>
            <article><span>02</span><h3>Evidence-informed practice</h3><p>Interventions selected thoughtfully according to presenting concerns.</p></article>
            <article><span>03</span><h3>Compassionate support</h3><p>A respectful space to feel heard, understood and supported.</p></article>
            <article><span>04</span><h3>Developmentally appropriate</h3><p>Support for children, adolescents and adults.</p></article>
          </div>
        </div>
      </section>

      <section className="mk-section mk-services" id="mk-services">
        <div className="mk-container">
          <div className="mk-heading"><span className="mk-eyebrow">THERAPEUTIC SERVICES</span><h2>Support for life's many seasons.</h2><p>Online individual therapy for children, adolescents and adults.</p></div>
          <div className="mk-service-grid">
            <article><span>✿</span><h3>Psychological therapy &amp; counselling</h3><p>Individual therapeutic support guided by your concerns, needs and goals.</p></article>
            <article><span>❋</span><h3>Personal growth &amp; emotional wellbeing</h3><p>Explore emotional patterns, coping strategies, boundaries and relationships.</p></article>
            <article><span>✧</span><h3>Psychological assessment</h3><p>Screening, psychometric assessment and reports may be included when clinically indicated and relevant.</p></article>
          </div>
          <p className="mk-therapy-note">Therapeutic work may draw on CBT, psychodynamic-informed and trauma-informed approaches, depending on the person's needs and clinical suitability.</p>
        </div>
      </section>

      <section className="mk-section mk-packages" id="mk-packages">
        <div className="mk-container">
          <div className="mk-heading"><span className="mk-eyebrow">BALENZA THERAPY · YOUR JOURNEY</span><h2>Choose your therapy journey.</h2><p>Three structured options to support different levels of therapeutic engagement. The most suitable plan is best decided collaboratively after understanding your concerns.</p></div>
          <div className="mk-package-grid">{packages.map((plan,index)=><article className={"mk-package "+(index===1?"mk-featured":"")} key={plan.name}>
            <span className="mk-package-label">{index===0?"A GENTLE BEGINNING":index===1?"STRUCTURED GROWTH":"SUSTAINED SUPPORT"}</span>
            <h3>{plan.name}</h3><p className="mk-package-line">{plan.line}</p><div className="mk-price">{plan.price}<small> / package</small></div>
            <div className="mk-package-meta"><span><b>{plan.sessions}</b>Sessions</span><span><b>{plan.validity}</b>Validity</span><span><b>45–50 min</b>Per session</span></div>
            <h4>About this plan</h4><p>{plan.about}</p>
            <h4>What's included</h4><ul>{plan.includes.map(item=><li key={item}>{item}</li>)}</ul>
            <h4>May suit people experiencing</h4><p>{plan.ideal}</p>
            <a className="mk-btn mk-package-cta" href={whatsapp+"?text="+encodeURIComponent("Hello Balenza Therapy, I would like to enquire about the "+plan.name+" package.")} target="_blank" rel="noreferrer">Enquire about {plan.name} ↗</a>
          </article>)}</div>
          <p className="mk-package-disclaimer">Assessment, psychometric tools and psychological reports are considered and provided when clinically indicated and appropriate; they are not automatic requirements for every client. Package suitability, scheduling and the therapeutic plan are discussed collaboratively before starting.</p>
        </div>
      </section>

      <section className="mk-section mk-psychologist" id="mk-psychologist">
        <div className="mk-container"><div className="mk-professional">
          <span className="mk-eyebrow">PROFESSIONAL CARE</span><h2>Vanshika Arora</h2><div className="mk-role">REHABILITATION PSYCHOLOGIST · RCI REGISTERED</div>
          <p>MA Clinical Psychology <i>·</i> PGDRP</p>
          <div className="mk-professional-rule"></div>
          <p className="mk-professional-copy">Psychological therapy and counselling delivered through an individualised, evidence-informed and compassionate approach. Care is shaped around each person's concerns, goals, developmental needs and clinical suitability.</p>
        </div></div>
      </section>

      <section className="mk-contact" id="mk-contact">
        <div className="mk-container"><span className="mk-eyebrow">A FIRST STEP, AT YOUR PACE</span><h2>Let's talk about what support could look like.</h2><p>Reach out to ask a question or enquire about the therapy packages.</p>
          <div className="mk-actions mk-contact-actions"><a className="mk-btn mk-btn-cream" href={"tel:"+contactPhone}>Call 96902 71414</a><a className="mk-btn mk-btn-outline" href={whatsapp+"?text=Hello%20Balenza%20Therapy%2C%20I%27d%20like%20to%20know%20more."} target="_blank" rel="noreferrer">WhatsApp ↗</a><a className="mk-btn mk-btn-outline" href="https://www.instagram.com/balenza.therapy/" target="_blank" rel="noreferrer">Instagram @balenza.therapy ↗</a></div>
          <div className="mk-contact-small"><a href={"tel:"+contactPhone}>+91 96902 71414</a><a href="https://www.instagram.com/balenza.therapy/" target="_blank" rel="noreferrer">@balenza.therapy</a></div>
          <p className="mk-contact-note">Website information is general and does not replace an individual assessment or professional advice. If you are in immediate danger or need urgent help, contact local emergency services or an appropriate crisis service.</p>
        </div>
      </section>
    </main>
    <footer className="mk-footer"><span>BALENZA THERAPY</span><span>Where Healing Is Human</span><span>© {new Date().getFullYear()} Balenza Therapy</span></footer>
  </div>;
}
