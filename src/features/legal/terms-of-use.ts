import { LEGAL_LAST_UPDATED, LEGAL_OPERATOR } from "./constants";
import type { LegalDocumentContent } from "./types";

export const TERMS_OF_USE: LegalDocumentContent = {
  title: "Terms of Use",
  eyebrow: "Legal",
  description: `These Terms of Use govern your access to the ${LEGAL_OPERATOR} website, learning platform, and related services. By creating an account, logging in, or using the site, you agree to these terms.`,
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      title: "Agreement",
      paragraphs: [
        "Please read these Terms of Use carefully. If you do not agree, do not create an account, log in, or use the services.",
        "When you continue from the login or register form, you confirm that you have read these terms and our Privacy Notice.",
      ],
    },
    {
      title: "Who we are",
      paragraphs: [
        `${LEGAL_OPERATOR} operates this learning platform, including public program pages, course catalog access, and student accounts. References to “we”, “us”, and “our” mean ${LEGAL_OPERATOR}.`,
      ],
    },
    {
      title: "Eligibility and accounts",
      paragraphs: [
        "You must provide accurate information when you register. Account signup currently collects your full name, email address, and password.",
        "You are responsible for keeping your password confidential and for activity on your account. Notify us promptly if you believe someone else has used your account.",
        "One person should use one account. We may refuse, suspend, or close an account if information is false, access is shared in a way that violates these terms, or we reasonably believe the account is being misused.",
      ],
    },
    {
      title: "The LMS and course access",
      paragraphs: [
        "The platform may list published courses, lessons, and related learning materials. Enrollment and playback access are granted by Digica. In-app checkout is not available yet.",
        "Having an account does not by itself give you access to paid or restricted course content. Access depends on an active entitlement we associate with your account.",
        "We may update course materials, change availability, or revoke access when an entitlement expires or is withdrawn.",
      ],
    },
    {
      title: "Program registration",
      paragraphs: [
        "Workshops, mini bootcamps, and bootcamps may have a separate registration flow. Submitting that form is an application or enrollment request for the selected program, not a purchase completed inside this website.",
        "For paid programs, payment instructions and confirmation may continue over WhatsApp with our admin team. Program fees, schedules, and offers are as described on the relevant program page at the time you register, unless we tell you otherwise in writing.",
      ],
    },
    {
      title: "Acceptable use",
      paragraphs: [
        "You agree to use the services only for lawful learning purposes and in a way that does not harm other learners, instructors, or the platform.",
      ],
      bullets: [
        "Do not share your login, lesson videos, or other restricted materials with people who are not entitled to them.",
        "Do not scrape, copy, or redistribute course content except as we expressly allow for your personal study.",
        "Do not attempt to bypass access controls, disrupt the service, or probe it in an unauthorized way.",
        "Do not submit false registration details or use the services to harass others.",
      ],
    },
    {
      title: "Intellectual property",
      paragraphs: [
        "Course videos, written lessons, program materials, branding, and the site design are owned by Digica or our licensors. We grant you a limited, personal, non-transferable license to access entitled content for your own learning while your access remains active.",
        "You may not sell, sublicense, publicly post, or commercially exploit our materials unless we agree in writing.",
      ],
    },
    {
      title: "Suspension and termination",
      paragraphs: [
        "We may suspend or terminate access if you breach these terms, if an entitlement is unpaid, expired, or revoked, or if we need to protect the platform or other users.",
        "You may stop using the services at any time. Account deletion or data requests are handled as described in the Privacy Notice.",
      ],
    },
    {
      title: "Disclaimers",
      paragraphs: [
        "The services are provided on an “as is” and “as available” basis. Learning outcomes, job results, and career changes depend on many factors outside our control. We do not guarantee uninterrupted access, error-free content, or a particular employment result.",
        "Where the law does not allow a disclaimer, it applies only to the extent permitted.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        `To the fullest extent permitted by applicable law, ${LEGAL_OPERATOR} is not liable for indirect, incidental, special, or consequential losses, including lost profits, data, or opportunity, arising from your use of the services.`,
        "Our total liability for claims relating to the services is limited to the amount you paid us for the specific program or access giving rise to the claim in the twelve months before the claim, or IDR 0 if you have not paid us for that access.",
      ],
    },
    {
      title: "Changes to these terms",
      paragraphs: [
        "We may update these Terms of Use from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the services after an update means you accept the revised terms.",
      ],
    },
    {
      title: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the Republic of Indonesia. Courts in Indonesia have jurisdiction over disputes arising from these terms, without limiting any non-waivable consumer rights you may have.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Questions about these terms can be sent using the contact options at the bottom of this page.`,
      ],
    },
  ],
};
