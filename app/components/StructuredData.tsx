import { FAQ_DATA } from "@/app/lib/faq";
import { SITE, SITE_URL } from "@/app/lib/site";

/**
 * One JSON-LD `@graph` rather than several loose blocks, so the entities can
 * reference each other by @id and a parser sees one connected description of
 * the page instead of four unrelated ones.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE.origin}/#org` },
        featureList: [
          "Email syntax validation",
          "MX record lookup",
          "Live SMTP mailbox check",
          "Catch-all domain detection",
          "Role and disposable address detection",
          "Bulk verification from a pasted list or CSV upload",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${SITE.origin}/#org` },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": `${SITE.origin}/#org`,
        name: "APILayer",
        url: "https://apilayer.com/",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ_DATA.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/#howto`,
        name: "How to check whether an email address is real",
        description:
          "Verify that an email address exists and can receive mail before you send to it.",
        totalTime: "PT10S",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter the address",
            text: "Paste a single email address, a comma-separated list, or upload a CSV.",
          },
          {
            "@type": "HowToStep",
            name: "Read the individual checks",
            text: "Syntax, MX records, the live SMTP result, catch-all, role and disposable flags are each reported separately rather than collapsed into one verdict.",
          },
          {
            "@type": "HowToStep",
            name: "Act on the score",
            text: "Use the deliverability score to decide what to keep. Catch-all domains cannot be verified per address, so treat those separately.",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
