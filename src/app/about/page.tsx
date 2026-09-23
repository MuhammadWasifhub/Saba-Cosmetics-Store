import WhatsAppCTA from '@/components/WhatsAppCTA';

export default function AboutPage() {
  return (
  <>
    <main className="container" style={{ paddingTop: 64, paddingBottom: 100, maxWidth: 720 }}>
      <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 16 }}>Our story</p>
      <h1 style={{ fontSize: 38, marginBottom: 24 }}>
        Skincare should be simple, honest, and for everyone.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 20 }}>
        Saba Cosmetics started with a simple idea: beauty essentials in Pakistan shouldn't mean
        choosing between quality and affordability. We formulate every product to be gentle on
        skin, honest about ingredients, and priced for everyday life.
      </p>
      <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.8 }}>
        From our first serum to every product since, our mission has stayed the same — create
        effective care for every skin type and tone, without the noise, without the guesswork.
      </p>
    </main>
    <WhatsAppCTA />
  </>
  );
}
