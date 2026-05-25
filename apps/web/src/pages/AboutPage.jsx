
import React from 'react';
import { Helmet } from 'react-helmet';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Match by Birth</title>
        <meta name="description" content="Learn about our mission to help you understand compatibility, including our unique 7-person Group Mode." />
      </Helmet>

      <main className="py-20 md:py-24 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-slate dark:prose-invert prose-headings:text-balance prose-h1:text-4xl prose-h1:font-extrabold prose-a:text-primary mx-auto">
            <h1>About Match by Birth</h1>
            
            <p className="lead text-xl text-muted-foreground font-medium">
              We built Match by Birth to give everyone a fun, approachable way to explore the dynamics of their relationships through the lens of astrology.
            </p>

            <h2>Our Mission</h2>
            <p>
              Human connection is complex. Our goal is to provide a playful yet insightful tool that helps people understand how they interact with their friends, family, and romantic partners. We believe that astrology is a fantastic mirror for self-reflection—giving you a shared vocabulary to talk about communication styles, emotional needs, and natural chemistry.
            </p>

            <h2>Group Mode: Check the Vibe</h2>
            <p>
              Dynamics change entirely when more people enter the room. That’s why we created our signature <strong>Group Mode</strong>. You can add up to 7 people at once to calculate an overall "Group Vibe Score."
            </p>
            <p>
              Behind the scenes, our calculator analyzes the compatibility of every possible pair within your group and aggregates the data into a single, cohesive score. Whether you’re planning a road trip, forming a project team, or just curious about your friend group's cosmic balance, Group Mode lays it all out.
            </p>

            <h2>Share the Stars</h2>
            <p>
              A great reading is meant to be shared. We’ve built in seamless sharing features so you can effortlessly show your friends your match scores. 
            </p>
            <ul>
              <li><strong>Unique URLs:</strong> Your results are encoded directly into the web address. Just copy the URL and send it in your group chat.</li>
              <li><strong>Social Previews:</strong> Share your link on Twitter or iMessage, and our Open Graph (OG) previews will automatically display a customized card showing who was matched.</li>
            </ul>

            <h2>Get in Touch</h2>
            <p>
              We're always working to make our readings more accurate, inclusive, and fun. If you have any feedback or just want to say hi, reach out to us at <a href="mailto:support@matchbybirth.com">support@matchbybirth.com</a>.
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

export default AboutPage;
