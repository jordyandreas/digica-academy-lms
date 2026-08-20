import { LEGAL_LAST_UPDATED, LEGAL_OPERATOR } from "./constants";
import type { LegalDocumentContent } from "./types";

export const PRIVACY_NOTICE: LegalDocumentContent = {
  title: "Privacy Notice",
  eyebrow: "Legal",
  description: `This Privacy Notice explains how ${LEGAL_OPERATOR} collects, uses, and shares personal data when you register, log in, update your profile, or enroll in a program. It reflects how the platform works today.`,
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      title: "Who we are",
      paragraphs: [
        `${LEGAL_OPERATOR} is the operator of this website and learning platform and the organization responsible for the personal data described here. You can reach us using the contact options at the bottom of this page.`,
      ],
    },
    {
      title: "Data we collect",
      paragraphs: [
        "We collect the information you submit and the technical data needed to keep you signed in.",
      ],
      bullets: [
        "Account signup and login: full name, email address, and password. Passwords are stored in hashed form, not as readable text.",
        "Student profile: phone number, occupation, and organization, if you add them. These details can prefill program registration when you are logged in.",
        "Program registration: name, email, phone, occupation, and organization. Paid bootcamp or mini bootcamp registrations may also include registration source, selected package, package price, and, for a “join with a friend” package, your friend’s name and phone number.",
        "Usage needed to run the service: account identifiers, course access records, and session cookies that keep you logged in.",
      ],
    },
    {
      title: "How we use your data",
      paragraphs: [
        "We use personal data to operate the platform and deliver the programs you request.",
      ],
      bullets: [
        "Create and authenticate your account, and keep your session active.",
        "Grant and check course access associated with your account.",
        "Process program enrollment and follow up on payment or onboarding through the contact channel you choose.",
        "Respond to support, privacy, or account requests.",
        "Maintain security, prevent abuse, and meet legal obligations.",
      ],
    },
    {
      title: "Cookies and similar technology",
      paragraphs: [
        "We use essential session cookies so we can keep you signed in after you log in. These cookies are required for the login session to work.",
        "We do not currently use marketing analytics pixels or advertising cookies on this site. If that changes, we will update this notice.",
      ],
    },
    {
      title: "Who we share data with",
      paragraphs: [
        "We do not sell your personal data. We share it only as needed to run the service.",
      ],
      bullets: [
        "Our team, to operate accounts, course access, and program registrations.",
        "Service providers that host the platform, keep you signed in, and store the records we need to deliver the service.",
        "Messaging apps you use to contact us (for example WhatsApp), so we can reply.",
        "Authorities, if we are required by law to disclose information.",
      ],
    },
    {
      title: "Processing outside Indonesia",
      paragraphs: [
        "Some of the systems we use to run the platform may process data on servers outside Indonesia. Where that happens, we rely on contractual and security measures. By using the services, you understand that your data may be transferred to and stored in those locations.",
      ],
    },
    {
      title: "How long we keep data",
      paragraphs: [
        "We keep account, profile, entitlement, and program registration records for as long as we need them to provide the services, handle payments or access disputes, and meet record-keeping duties. If you ask us to delete your account, we will remove or anonymize personal data we no longer need, unless we must retain it for legal, security, or financial reasons.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Subject to applicable law, including Indonesia’s personal data protection rules, you may request to access, correct, or delete personal data we hold about you, or withdraw consent where processing is based on consent.",
        "You can update some profile fields yourself when you are logged in. For other requests, use the contact options at the bottom of this page and describe what you need. We may ask you to confirm your identity before we act.",
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "The services are intended for learners who can form a valid agreement under applicable law. We do not knowingly collect personal data from children in a way that is not permitted. If you believe we have data that should not have been collected, contact us so we can review and delete it where required.",
      ],
    },
    {
      title: "Changes to this notice",
      paragraphs: [
        "We may update this Privacy Notice when our practices or the law change. The “Last updated” date at the top of this page will change when we do. Material changes will apply going forward from the updated date.",
      ],
    },
    {
      title: "How to contact us",
      paragraphs: [
        `For privacy or data requests, use the contact options at the bottom of this page.`,
      ],
    },
  ],
};
