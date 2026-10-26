export interface IFaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Shared by the FAQ section and the structured data, so what a reader sees and
 * what an answer engine quotes cannot drift apart. Kept out of the component
 * because a server component importing from a "use client" module gets a
 * client reference, not the array.
 */
export const FAQ_DATA: IFaqItem[] = [
  {
    id: "faq-1",
    question: "How do I check if an email address is real?",
    answer:
      "Paste it in. The tool runs four checks in order: whether the address is syntactically valid, whether the domain publishes MX records that can accept mail, whether the mail server accepts that specific mailbox when asked over SMTP, and whether the domain accepts everything regardless. Together those tell you whether mail sent to the address has somewhere to land.",
  },
  {
    id: "faq-2",
    question: "What is an MX record and why does it matter?",
    answer:
      "An MX record is the DNS entry that says which server receives mail for a domain. If a domain publishes none, nothing can be delivered there at all, no matter how well formed the address looks. It is the cheapest and most decisive check available, which is why it runs before the SMTP step.",
  },
  {
    id: "faq-3",
    question: "What is a catch-all address?",
    answer:
      "A catch-all domain accepts mail for every possible mailbox rather than only the ones that exist. That makes per-address verification impossible: the server says yes to anything, so a positive result proves nothing. The tool flags catch-all domains explicitly instead of reporting a false pass.",
  },
  {
    id: "faq-4",
    question: "What is a disposable email address?",
    answer:
      "A temporary inbox from a service built to expire, used to get past a sign-up form without handing over a real address. They are valid and deliverable right now and useless to you a week later, so they are flagged separately rather than counted as failures.",
  },
  {
    id: "faq-5",
    question: "What is a role address?",
    answer:
      "An address that belongs to a function rather than a person: info@, support@, sales@, admin@. They are usually real and deliverable, but they tend to reach shared inboxes, attract higher complaint rates and hurt sender reputation, so most senders exclude them from marketing lists.",
  },
  {
    id: "faq-6",
    question: "Why verify a list before sending to it?",
    answer:
      "Mailbox providers judge you on bounce rate. Sending to addresses that do not exist is the fastest way to have your domain filtered into spam for everyone else on the list. Cleaning the list first protects the deliverability of the mail you actually care about.",
  },
  {
    id: "faq-7",
    question: "Can I check a whole list at once?",
    answer:
      "Yes. Paste a comma-separated list or upload a CSV and every address is checked and returned in one table, with the result of each individual check shown rather than a single pass or fail.",
  },
  {
    id: "faq-8",
    question: "What is Mailboxlayer?",
    answer:
      "Mailboxlayer is an email verification API from APILayer. It performs syntax, MX, SMTP, catch-all, role and disposable checks and returns a deliverability score as structured JSON. It is the API behind this page, and it has a free tier.",
  },
];
