import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Match by Birth</title>
        <meta name="description" content="Learn about our mission to help you understand compatibility, including our unique 7-person Group Mode." />
      </Helmet>

      <main className="py-20 md:py-24 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="mx-auto">
            {/* Eyebrow / small label */}
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">About Match by Birth</p>

            {/* Hero */}
            <header className="mt-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
                Astrology meets science. Love meets data.
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-[65ch]">
                Match by Birth helps you understand the people in your life through the oldest compatibility system on earth.
              </p>

              <div className="mt-6">
                <Link to="/" className="inline-block bg-primary text-white font-semibold rounded-md px-5 py-3">
                  Try the Calculator →
                </Link>
              </div>
            </header>

            {/* Divider */}
            <div className="my-10 border-t border-muted-foreground/20" />

            {/* Section: Our Mission */}
            <section className="py-12">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">Our Mission</h2>
              <div className="max-w-[65ch] text-base text-muted-foreground">
                <p>
                  Human connection is complex. Our goal is to provide a playful yet insightful tool that helps people understand how they interact with their friends, family, and romantic partners. We believe that astrology is a fantastic mirror for self-reflection—giving you a shared vocabulary to talk about communication styles, emotional needs, and natural chemistry.
                </p>
              </div>
            </section>

            <div className="border-t border-muted-foreground/20" />

            {/* Section: Group Mode */}
            <section className="py-12">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">Group Mode: Check the Vibe</h2>
              <div className="max-w-[65ch] text-base text-muted-foreground">
                <p>
                  Dynamics change entirely when more people enter the room. That’s why we created our signature <strong>Group Mode</strong>. You can add up to 7 people at once to calculate an overall "Group Vibe Score."
                </p>
                <p className="mt-4">
                  Behind the scenes, our calculator analyzes the compatibility of every possible pair within your group and aggregates the data into a single, cohesive score. Whether you’re planning a road trip, forming a project team, or just curious about your friend group's cosmic balance, Group Mode lays it all out.
                </p>
              </div>
            </section>

            <div className="border-t border-muted-foreground/20" />

            {/* Section: Share the Stars */}
            <section className="py-12">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">Share the Stars</h2>
              <div className="max-w-[65ch] text-base text-muted-foreground">
                <p>
                  A great reading is meant to be shared. We’ve built in seamless sharing features so you can effortlessly show your friends your match scores.
                </p>
                <ul className="mt-4 list-disc list-inside">
                  <li><strong>Unique URLs:</strong> Your results are encoded directly into the web address. Just copy the URL and send it in your group chat.</li>
                  <li className="mt-2"><strong>Social Previews:</strong> Share your link on Twitter or iMessage, and our Open Graph (OG) previews will automatically display a customized card showing who was matched.</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-muted-foreground/20" />

            {/* Section: Get in Touch */}
            <section className="py-12">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3">Get in Touch</h2>
              <div className="max-w-[65ch] text-base text-muted-foreground">
                <p>
                  We're always working to make our readings more accurate, inclusive, and fun. If you have any feedback or just want to say hi, reach out to us at <a href="mailto:support@matchbybirth.com" className="text-primary">support@matchbybirth.com</a>.
                </p>
              </div>
            </section>

          </article>
        </div>

        {/* Full-width Bottom CTA Banner above footer */}
        <div className="mt-12 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Ready to check your compatibility?</h2>
            <Link to="/" className="inline-block bg-primary text-white font-semibold rounded-md px-6 py-3">
              Get Your Score →
            </Link>
          </div>
        </div>

      </main>
    </>
  );
}

export default AboutPage;
