import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalUpdated } from "@/components/LegalPage";
import { SupportWhatsAppLink } from "@/components/SupportWhatsAppLink";
import { PAYMENTS_EMAIL, PLATFORM_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy · ${PLATFORM_NAME}`,
  description: `How ${PLATFORM_NAME} collects, uses, and protects information on the trading platform.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      subtitle={`How ${PLATFORM_NAME} collects, uses, and protects information on the trading platform: accounts, farm access, orders, escrow, chat, and the research library.`}
    >
      <LegalUpdated />

      <h2>1. Who we are</h2>
      <p>
        {PLATFORM_NAME} (“we”) operates this trading platform from Accra, Ghana. This policy
        explains what we collect when you use the marketplace, farm access, escrow orders, liaison
        tools, and research library.         For privacy questions, use{" "}
        <SupportWhatsAppLink showIcon={false} className="support-whatsapp-inline" />{" "}
        or email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>Depending on your role, we may collect:</p>
      <ul>
        <li>
          <strong>Account:</strong> name, email, phone, password (stored hashed), country, region,
          city, address, role, and profile photo.
        </li>
        <li>
          <strong>Fellow profiles:</strong> farm or organisation name, experience, commodities,
          quantities, units, prices, harvest or delivery windows, and listing photos.
        </li>
        <li>
          <strong>Client and liaison profiles:</strong> company or industry where provided, and
          assignment to a fellow or client.
        </li>
        <li>
          <strong>Researcher profiles:</strong> institution, expertise, bio, qualifications, and
          publication-policy acceptance.
        </li>
        <li>
          <strong>Activity:</strong> marketplace views after access, connection requests, chat
          messages, orders, escrow status, delivery confirmation, research uploads and library
          purchases, notifications, and support messages.
        </li>
        <li>
          <strong>Verification:</strong> verification status and badges assigned after review.
        </li>
      </ul>
      <p>
        If you sign in with Google, we receive the name, email, and profile photo Google shares for
        that login.
      </p>

      <h2>3. Payments</h2>
      <p>
        Card and mobile-money details are collected by Paystack, not stored on our servers. We keep
        transaction references, amounts, status, payment method type, farm-access records, order
        records, and escrow state so we can fulfil access, hold product funds until the 4-digit
        delivery code is entered, split released funds, and process refunds.
      </p>
      <p>
        Payment disputes and refunds: <a href={`mailto:${PAYMENTS_EMAIL}`}>{PAYMENTS_EMAIL}</a>.
      </p>

      <h2>4. How we use data</h2>
      <ul>
        <li>To create and secure your account, including email verification</li>
        <li>To run the marketplace, farm access, connections, chat, orders, escrow, and library</li>
        <li>To show counterparties what a trade requires after access is paid</li>
        <li>To notify you about connections, orders, access, delivery, and support</li>
        <li>To verify users, reduce fraud, and let accountants review unmatched payments</li>
        <li>To distribute released escrow and record withdrawals</li>
        <li>To handle refunds and improve the service</li>
      </ul>

      <h2>5. Sharing</h2>
      <p>We share personal data only as needed to operate a trade or as the law requires:</p>
      <ul>
        <li>
          After farm access, a client sees fellow production details, location as shown on the
          profile, and can message that fellow.
        </li>
        <li>A fellow sees order and client details needed to fulfil a purchase.</li>
        <li>
          Assigned liaison officers see what they need to represent a fellow or client, including
          relevant chat and order information.
        </li>
        <li>Staff and accountants see payment, escrow, and distribution records to settle funds.</li>
        <li>Paystack processes payments. Our hosting and file-storage providers process data we store.</li>
        <li>We may disclose information if required by Ghana law or to protect users from fraud or harm.</li>
      </ul>
      <p>We do not sell personal data.</p>

      <h2>6. Cookies and local storage</h2>
      <p>
        We use essential session storage (including an access token in your browser) so you stay
        signed in and the app can call our API. We do not use this for advertising. You can sign out
        to clear the session on that device.
      </p>

      <h2>7. Storage and security</h2>
      <p>
        We use industry-standard measures such as encrypted transit, hashed passwords, and
        role-based access. No online service is perfectly secure. Keep your password and 4-digit
        release codes private. Profile photos and listing images are stored with our file-storage
        provider so they can be shown in the app.
      </p>

      <h2>8. Retention</h2>
      <p>
        We keep account, order, farm-access, escrow, and payment records for as long as needed to
        operate the platform, settle funds, handle disputes, and meet tax or legal duties. Chat and
        listings remain while your account is active unless we remove them for a policy breach.
        You may ask us to correct or delete personal data we no longer need to keep.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Under Ghana’s Data Protection Act, 2012 (Act 843) and similar rules that may apply, you may
        request access to, correction of, or deletion of your personal data, or object to certain
        processing. Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We may need to
        verify your identity. We may retain records required for escrow, refunds, fraud prevention,
        or law.
      </p>

      <h2>10. Children</h2>
      <p>
        The platform is intended for adults who can enter a trade. Do not create an account if you
        are under 18.
      </p>

      <h2>11. International use</h2>
      <p>
        {PLATFORM_NAME} serves users across Africa and beyond. Your information may be processed in
        Ghana and in countries where our hosting, Paystack, or storage providers operate. We do so
        to provide the service you requested.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this policy. The date at the top is the current version. Material changes will
        be reflected on this page.
      </p>

      <h2>13. Related pages</h2>
      <p>
        <Link href="/terms">Terms of use</Link>
      </p>
    </LegalPage>
  );
}
