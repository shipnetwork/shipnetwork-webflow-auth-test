import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function Page() {
  const categories = [
    { 
      name: "General", 
      path: "/portal/knowledge-base/general",
      description: "Learn more about general topics."
    },
    { 
      name: "Shipping", 
      path: "/portal/knowledge-base/shipping",
      description: "Learn more about shipping topics."
    },
    { 
      name: "Account", 
      path: "/portal/knowledge-base/account",
      description: "Learn more about account topics."
    },
    { 
      name: "FAQs", 
      path: "/portal/knowledge-base/faqs",
      description: "Frequently asked questions."
    },
  ];

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Knowledge Base</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">Knowledge Base</h2>
                  <p className="text-muted-foreground">
                    Browse help articles, guides, and FAQs to learn more about ShipNetwork.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <Link key={cat.name} href={cat.path}>
                      <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
                        <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      </Card>
                    </Link>
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

