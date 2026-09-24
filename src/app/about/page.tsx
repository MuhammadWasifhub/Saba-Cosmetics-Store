import WhatsAppCTA from '@/components/WhatsAppCTA';

export default function AboutPage() {
  return (
  <>
    <main className="container" style={{ paddingTop: 64, paddingBottom: 100, maxWidth: 720 }}>
      <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 16 }}>Our story</p>
      <h1 style={{ fontSize: 38, marginBottom: 24 }}>
        Hi, I’m <strong>Saba Asim</strong>.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        I’ve been working in the beauty industry for over <strong>13 years</strong>, mainly helping
        salons and beauty professionals find and access quality, branded products they can rely on.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        Over the years, I’ve been fortunate to build lasting relationships with my clients. Their
        trust, kind feedback, and continued support mean a lot to me. I’m truly thankful to everyone
        who trusts my recommendations and chooses to work with me.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        I’m also grateful to the suppliers I work with. Their support and commitment to making
        products available according to my clients’ needs and timelines helps me keep everything
        running smoothly and serve my clients better.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        What started with experience and a passion for beauty has grown through{' '}
        <strong>trust, relationships, and years of serving people who value quality</strong>.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        That’s a little bit about me and the story behind Saba Cosmetics.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8 }}>
        <strong>Thank you for your trust and for being part of this journey.</strong>
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginTop: 20 }}>
        — <strong>Saba Asim</strong>
      </p>
    </main>
    <WhatsAppCTA />
  </>
  );
}