import Link from 'next/link';

export const metadata = {
  title: 'Order, Payment, Shipping & Returns Policy. Saba Cosmetics',
};

export default function PoliciesPage() {
  return (
    <main className="container" style={{ paddingTop: 56, paddingBottom: 88, maxWidth: 720 }}>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 10 }}>
        Last updated: September 2026
      </p>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        Order, Payment, Shipping &amp; Returns Policy
      </h1>
      <p style={{ fontSize: 15.5, color: 'var(--color-muted)', marginBottom: 48, lineHeight: 1.7 }}>
        A few honest, simple details on how ordering, payment, delivery, and returns work at
        Saba Cosmetics.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <section>
          <h2 style={sectionTitle}>Placing an Order</h2>
          <p style={bodyText}>
            When you place an order with us, you'll be guided through a simple two step
            process, sharing your delivery details, followed by payment. Once your order is
            placed, you'll receive a unique Order Number and a Customer ID. Please save both,
            as you'll need them for any future order related queries.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Payment</h2>
          <p style={bodyText}>
            We currently accept payments via <strong>Easypaisa</strong> only. After placing your
            order, you'll be shown our Easypaisa account details along with the exact amount to
            pay. Please double check the account name and number before sending payment, and
            upload a clear screenshot of your transaction as proof. Your order will be confirmed
            once our team verifies the payment, this usually takes a few hours.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Shipping &amp; Delivery</h2>
          <p style={bodyText}>
            Once your payment is verified, your order is prepared and dispatched. Delivery
            typically takes <strong>2–3 business days</strong> within major cities, and may take
            slightly longer for remote areas. You'll be contacted on the phone number provided
            at checkout if there are any delays.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Returns &amp; Complaints</h2>
          <p style={{ ...bodyText, marginBottom: 20 }}>
            Your satisfaction matters to us. If something isn't right with your order, here's
            how we handle it:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={policyCard}>
              <p style={policyCardTitle}>Damaged or incorrect item received</p>
              <p style={policyCardText}>
                If we made an error or your product arrived damaged, please reach out within{' '}
                <strong>3 days of delivery</strong> with your Customer ID and photos of the item.
                We'll arrange a free replacement, no extra cost to you.
              </p>
            </div>

            <div style={policyCard}>
              <p style={policyCardTitle}>Change of mind</p>
              <p style={policyCardText}>
                Due to the nature of cosmetic and skincare products, we're only able to accept
                change of mind returns for items that remain{' '}
                <strong>unopened, unused, and in their original sealed packaging</strong>, within
                3 days of delivery. In this case, return shipping charges will be the customer's
                responsibility.
              </p>
            </div>

            <div style={policyCard}>
              <p style={policyCardTitle}>Used or opened products</p>
              <p style={policyCardText}>
                These cannot be returned, for hygiene and safety reasons, unless the item is
                confirmed defective.
              </p>
            </div>
          </div>

          <p style={{ ...bodyText, marginTop: 20 }}>
            To start a return or file a complaint, simply fill out our{' '}
            <Link href="/returns" style={{ color: 'var(--color-ink)', textDecoration: 'underline' }}>
              Returns &amp; Complaints form
            </Link>{' '}
            with your Customer ID, our team will review and respond promptly.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Refunds</h2>
          <p style={bodyText}>
            Approved refunds are issued as store credit or a replacement product. In select
            cases, refunds may be issued back to the original Easypaisa account used for
            payment, subject to verification.
          </p>
        </section>

        <section
          style={{
            background: 'var(--color-cream)',
            borderRadius: 14,
            padding: 28,
          }}
        >
          <h2 style={{ ...sectionTitle, marginBottom: 10 }}>Need Help?</h2>
          <p style={{ ...bodyText, marginBottom: 0 }}>
            For any questions about your order, payment, or a return request, feel free to
            contact us. We're here to help.
          </p>
        </section>
      </div>
    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  marginBottom: 14,
};

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.75,
  color: 'var(--color-muted)',
};

const policyCard: React.CSSProperties = {
  border: '1px solid var(--color-hairline)',
  borderRadius: 12,
  padding: '18px 20px',
};

const policyCardTitle: React.CSSProperties = {
  fontSize: 14.5,
  fontWeight: 600,
  color: 'var(--color-ink)',
  marginBottom: 6,
};

const policyCardText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: 'var(--color-muted)',
};