import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  const faqs = [
    {
      question: "How do I create a support ticket?",
      answer: "Click the 'New Ticket' button in the sidebar or dashboard to create a new support ticket."
    },
    {
      question: "How long does it take to get a response?",
      answer: "Our support team typically responds within 24 hours during business days."
    },
    {
      question: "Can I track my shipments?",
      answer: "Yes, you can track all your shipments through the dashboard with real-time updates."
    },
    {
      question: "How do I update my account information?",
      answer: "Navigate to your account settings to update your profile and contact information."
    }
  ];

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/portal/knowledge-base">Knowledge Base</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>FAQs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground mb-6">
                    Find answers to common questions about ShipNetwork.
                  </p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

