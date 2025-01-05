import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appUrl } from "@/contants/consts"
import { ThemeProvider } from "@/providers/theme-provider"
import { TranslationProvider } from "@/providers/translation"
import { GeistSans } from "geist/font/sans"
import { Suspense } from "react"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Inventory",
  description: "The fastest way to manage your inventory",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <Suspense>
        <TranslationProvider>
          <TooltipProvider>
            <body>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster className="print:hidden" />
              </ThemeProvider>
            </body>
          </TooltipProvider>
        </TranslationProvider>
      </Suspense>
    </html>
  )
}
