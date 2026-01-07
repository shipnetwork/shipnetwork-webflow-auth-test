import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  const articles = [
    {
      title: "Stock & Packing Material Price List",
      path: "/portal/knowledge-base/account/stock-packing-material-price-list",
      description: "View pricing information for stock and packing materials."
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
              <BreadcrumbPage>Account</BreadcrumbPage>
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
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Account</h2>
                  <p className="text-muted-foreground mb-6">
                    Account management and settings information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {articles.map((article) => (
                    <Link key={article.path} href={article.path}>
                      <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {article.description}
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

