import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appUrl } from "@/contants/consts"
import { ThemeProvider } from "@/providers/theme-provider"
import { TranslationProvider } from "@/providers/translation"
import { GeistSans } from "geist/font/sans"
import { PropsWithChildren, Suspense } from "react"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Inventory",
  description: "The fastest way to manage your inventory",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <TranslationProvider>
        <TooltipProvider>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense>{children}</Suspense>
              <Toaster className="print:hidden" />
            </ThemeProvider>
          </body>
        </TooltipProvider>
      </TranslationProvider>
    </html>
  )
}
