import SignupForm from "@/components/SignupForm";

function EyeMark() {
  return (
    <svg className="eye-mark" viewBox="0 0 120 72" role="img" aria-label="Abstract eye symbol">
      <path d="M8 36C22 14 39 5 60 5s38 9 52 31C98 58 81 67 60 67S22 58 8 36Z" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="60" cy="36" r="16" fill="currentColor" />
      <circle cx="66" cy="30" r="5" fill="white" opacity=".92" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="UAMS Ophthalmology Interest Group home">
          <EyeMark />
          <span><strong>UAMS</strong><small>Ophthalmology Interest Group</small></span>
        </a>
        <a className="header-link" href="#signup">Join the group</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">University of Arkansas for Medical Sciences</span>
          <h1>Explore a future in <span>ophthalmology.</span></h1>
          <p className="hero-lead">Connect with students, physicians, mentors, and service opportunities through the UAMS Ophthalmology Interest Group.</p>

          <div className="feature-row">
            <div><b>01</b><span>Specialty exposure</span></div>
            <div><b>02</b><span>Mentorship</span></div>
            <div><b>03</b><span>Community service</span></div>
          </div>
        </div>

        <div id="signup"><SignupForm /></div>
      </section>

      <section className="mission-strip">
        <p>Learn. Connect. Serve.</p>
        <span>Building community around vision care and ophthalmic medicine.</span>
      </section>

      <footer>
        <span>UAMS Ophthalmology Interest Group</span>
        <span>This student interest group page is not an official UAMS institutional website.</span>
      </footer>
    </main>
  );
}
