import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
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
              <BreadcrumbLink asChild>
                <Link href="/portal/knowledge-base/account">Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Stock & Packing Material Price List</BreadcrumbPage>
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
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Stock & Packing Material Price List</h2>
                  <p className="text-muted-foreground mb-6">
                    View pricing information for stock and packing materials.
                  </p>
                </div>

                <Card className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                      Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
                      ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
                      massa, varius a, semper congue, euismod non, mi.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

