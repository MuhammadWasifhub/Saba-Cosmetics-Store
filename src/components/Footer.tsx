import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--color-cream)',
        borderTop: '1px solid var(--color-hairline)',
        marginTop: 0,
      }}
    >
      <div className="container" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <div className="footer-grid">
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                marginBottom: 14,
                letterSpacing: '-0.01em',
              }}
            >
              Saba Cosmetics
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: 320 }}>
              Branded &amp; imported beauty essentials, carefully curated for every skin type
              across Pakistan.
            </p>
          </div>

          <div>
            <p style={colTitle}>Shop</p>
            <ul style={listStyle}>
              <li><Link href="/all-products" style={linkStyle}>All Products</Link></li>
              <li><Link href="/all-products?category=Makeup" style={linkStyle}>Makeup</Link></li>
              <li><Link href="/all-products?category=Skincare" style={linkStyle}>Skincare</Link></li>
              <li><Link href="/all-products?category=Nail%20Paints" style={linkStyle}>Nail Paints</Link></li>
              <li><Link href="/all-products?category=Hand%20Bags" style={linkStyle}>Hand Bags</Link></li>
            </ul>
          </div>

          <div>
            <p style={colTitle}>Help</p>
            <ul style={listStyle}>
              <li><Link href="/policies" style={linkStyle}>Policies</Link></li>
              <li><Link href="/returns" style={linkStyle}>Returns &amp; Complaints</Link></li>
              <li><Link href="/about" style={linkStyle}>Our Story</Link></li>
              <li>
                <a
                  href="https://wa.me/923334882245"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Contact on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p style={colTitle}>Reach us</p>
            <ul style={listStyle}>
              <li style={{ ...linkStyle, cursor: 'default' }}>+92 333 488 2245</li>
              {/* <li style={{ ...linkStyle, cursor: 'default' }}>Daily · 10am – 9pm PKT</li> */}
            </ul>
            <div style={{ marginTop: 14 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 999,
                  fontSize: 12.5,
                  color: 'var(--color-muted)',
                  background: 'var(--color-white)',
                }}
              >
                Pay via Easypaisa
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--color-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
            color: 'var(--color-muted)',
          }}
        >
          <span>© {year} Saba Cosmetics. All rights reserved.</span>
          <span>Made with care in Pakistan 🇵🇰</span>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 520px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>
    </footer>
  );
}

const colTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--color-ink)',
  marginBottom: 16,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--color-muted)',
};