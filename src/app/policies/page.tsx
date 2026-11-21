export const metadata = {
  title: 'Order, Payment & Shipping Policy. Saba Cosmetics',
};

export default function PoliciesPage() {
  return (
    <main className="container" style={{ paddingTop: 56, paddingBottom: 88, maxWidth: 720 }}>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 10 }}>
        Last updated: September 2026
      </p>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Order, Payment &amp; Shipping Policy</h1>
      <p style={{ fontSize: 15.5, color: 'var(--color-muted)', marginBottom: 48, lineHeight: 1.7 }}>
        A few honest, simple details on how ordering, payment and delivery work at Saba Cosmetics.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <section>
          <h2 style={sectionTitle}>Placing an Order</h2>
          <p style={bodyText}>
            Placing an order is a simple two step process: share your delivery details, then
            complete your payment. Please double check your items and address before confirming.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Payment</h2>
          <p style={bodyText}>
            We currently accept payments via <strong>Easypaisa</strong> only. You’ll be shown our
            Easypaisa account details along with the exact amount to pay. Please double check the
            account name and number before sending payment, and upload a clear screenshot of your
            transaction as proof. Your order will be confirmed once our team verifies the payment,
            this usually takes a few hours.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>Shipping &amp; Delivery</h2>
          <p style={bodyText}>
            Once your payment is verified, your order is prepared and dispatched. Orders within{' '}
            <strong>Karachi</strong> are delivered in <strong>2–3 business days</strong>. Orders
            outside Karachi can take up to <strong>7 business days</strong>. We’ll contact you on
            the phone number provided at checkout if there are any delays.
          </p>
        </section>

        <section>
          <h2 style={sectionTitle}>No Returns</h2>
          <p style={bodyText}>
            Due to the nature of cosmetic and skincare products, we do not accept returns or
            exchanges once an order has been placed. Please review your order carefully before
            confirming it.
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
            For any questions about your order or payment, feel free to contact us. We’re here to
            help.
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