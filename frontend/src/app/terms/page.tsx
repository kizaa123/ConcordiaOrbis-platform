import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalUpdated } from "@/components/LegalPage";
import { SupportWhatsAppLink } from "@/components/SupportWhatsAppLink";
import { PAYMENTS_EMAIL, PLATFORM_NAME, SUPPORT_EMAIL, companyUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of use · ${PLATFORM_NAME}`,
  description: `Rules for using the ${PLATFORM_NAME} marketplace, farm access, escrow orders, and research library.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      subtitle={`These terms govern your use of the ${PLATFORM_NAME} trading platform: marketplace, farm access, escrow orders, liaison tools, and research library.`}
    >
      <LegalUpdated />

      <h2>1. Agreement</h2>
      <p>
        By creating an account or using {PLATFORM_NAME}, you agree to these terms and our{" "}
        <Link href="/privacy">privacy policy</Link>. If you use the platform for an organisation, you
        confirm you are authorised to bind that organisation. We may update these terms; the date
        above shows the current version. Continued use after a change means you accept the updated
        terms.
      </p>

      <h2>2. The platform</h2>
      <p>
        {PLATFORM_NAME} is a Ghana-based commodity marketplace. Verified fellows list produce.
        Clients browse public previews, pay a farm access fee to unlock a fellow’s production
        details, then place orders. Payments for goods are held in escrow until the client confirms
        delivery with a 4-digit release code. Fellow and client liaison officers can represent
        parties, chat, and help close deals. Researchers publish in the library; students and other
        users may purchase access to those works.
      </p>
      <p>
        We operate the software, hold product funds in escrow until release, and settle splits after
        delivery is confirmed. We do not take title to listed commodities unless a separate written
        agreement says otherwise.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You must register with accurate information, keep your password private, and complete any
        email verification we require. You may also sign in with Google. You are responsible for
        activity on your account. Tell us promptly if you believe it has been misused.
      </p>
      <p>
        We may refuse, suspend, or close accounts that are incomplete, misleading, abusive, or that
        we reasonably believe pose a fraud or compliance risk. Roles cannot be used to impersonate
        another person or to bypass farm access, escrow, or verification.
      </p>

      <h2>4. Roles</h2>
      <ul>
        <li>
          <strong>Fellows</strong> (crop, livestock, fruit, fish, or organisation) list commodities
          with prices, quantities, and harvest or delivery windows.
        </li>
        <li>
          <strong>Clients</strong> browse previews, pay farm access, request connections, and place
          product orders.
        </li>
        <li>
          <strong>Liaison officers</strong> support fellows or clients through negotiation,
          messaging, and fulfilment.
        </li>
        <li>
          <strong>Researchers</strong> publish work in the research library after accepting the
          publication policy.
        </li>
        <li>
          <strong>Students</strong> and other users may purchase and read publications.
        </li>
        <li>
          <strong>{PLATFORM_NAME} staff and accountants</strong> review verification, unmatched
          payments, escrow release, and fund distribution.
        </li>
      </ul>

      <h2>5. Marketplace and farm access</h2>
      <p>
        Marketplace previews are free. Full fellow data, quantities, contact details, and messaging
        unlock after the client pays the farm access fee shown at checkout. Access is tied to that
        fellow’s current harvest listings. When those windows end, or the fellow starts a new listing
        cycle, you may need to pay again to unlock updated production details.
      </p>
      <p>
        Do not scrape locked listings, share paid access with others, or try to bypass the fee.
        Fellows must list real produce with honest quantities, photos, prices, and dates. We may
        hide or remove listings that are fake, expired, or misleading.
      </p>

      <h2>6. Connections, chat, and liaison officers</h2>
      <p>
        After farm access, a client may request a connection. Fellows may accept or reject. Chat is
        provided so parties can negotiate on the platform. Liaison officers see what they need to
        represent an assigned fellow or client. Do not use chat to harass, defraud, or move a paid
        order fully off-platform in order to avoid escrow.
      </p>

      <h2>7. Orders, escrow, and delivery</h2>
      <p>
        Product payments are taken through Paystack (card, mobile money, or bank transfer). A
        declined or abandoned charge creates no order. Successful charges sit in escrow until the
        client confirms delivery.
      </p>
      <p>
        On purchase the client receives a 4-digit release code. Enter that code in My Orders when
        the goods arrive. Keep the code private. Do not share it, and do not enter it until you have
        received the order. Released funds are then split among the fellow, any assigned liaison
        officers, and {PLATFORM_NAME} according to the rates shown in the app at the time of the
        order. Accountants record those distributions and any withdrawals.
      </p>
      <p>
        Fellows and liaison officers must fulfil orders that have been paid. Quality, shortage, or
        non-delivery disputes should be raised with us before you release escrow where possible.
        After you confirm delivery with the release code, we only review documented quality or
        shortage issues, not a change of mind.
      </p>

      <h2>8. Research library</h2>
      <p>
        Researchers must accept the {PLATFORM_NAME} publication policy before publishing. You
        warrant that you have the right to publish the work, that it is not plagiarised, and that
        required citations, permissions, and ethics approvals are in place. We may review, suspend,
        or remove publications that breach copyright, ethics, or these terms.
      </p>
      <p>
        Library purchases are charged through Paystack. Access is granted to the purchasing account.
        The researcher and {PLATFORM_NAME} share publication proceeds as shown in the app at the
        time of sale.
      </p>

      <h2>9. Payments and refunds</h2>
      <p>
        Fees shown at checkout are due in the currency displayed. Farm access, product orders, and
        research purchases are separate charges. Duplicate, failed, or mistaken charges follow our{" "}
        <a href={companyUrl("/refunds")} target="_blank" rel="noopener noreferrer">
          refund policy
        </a>
        . Unused farm access may be refundable if you request it promptly and have not used the
        unlocked listings to order; once you unlock and trade, the fee is generally kept.
      </p>
      <p>
        Refund requests: email{" "}
        <a href={`mailto:${PAYMENTS_EMAIL}`}>{PAYMENTS_EMAIL}</a> with your name, account email,
        amount, date, and Paystack reference.
      </p>

      <h2>10. Verification</h2>
      <p>
        Verification badges are granted at our discretion after review. A badge is not a guarantee
        of harvest, creditworthiness, or product quality. We may remove verification if information
        is false or if the account is misused.
      </p>

      <h2>11. Acceptable use</h2>
      <ul>
        <li>No fake listings, stolen photos, or misrepresented quantities, prices, or harvest dates</li>
        <li>No attempts to bypass farm access, escrow, verification, or role restrictions</li>
        <li>No abuse of other users, liaison officers, or staff in chat or elsewhere</li>
        <li>No malware, scraping at scale, or interference with the service</li>
        <li>Research uploads must not infringe copyright or others’ rights</li>
        <li>Do not use {PLATFORM_NAME} for unlawful trade, including prohibited goods</li>
      </ul>

      <h2>12. Content you post</h2>
      <p>
        You keep ownership of listings, photos, messages, and research you upload. You grant{" "}
        {PLATFORM_NAME} a licence to host, display, and process that content so the marketplace and
        library can operate. You are responsible for what you post.
      </p>

      <h2>13. Liability</h2>
      <p>
        We operate the marketplace and hold product funds in escrow until delivery is confirmed. We
        do not guarantee that a fellow will harvest on time, that logistics will succeed, or that a
        counterparty will perform. Quality disputes after release are reviewed case by case. To the
        extent allowed by Ghana law, we are not liable for delays caused by Paystack, banks,
        mobile-money operators, weather, or logistics outside our control, or for indirect or
        consequential loss. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These terms are governed by the laws of Ghana. Courts in Accra have jurisdiction, without
        limiting any consumer rights you may have that cannot be waived.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions:{" "}
        <SupportWhatsAppLink showIcon={false} className="support-whatsapp-inline" />{" "}
        or <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. See also our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
