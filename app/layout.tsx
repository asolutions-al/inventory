import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appUrl } from "@/contants/consts"
import { ThemeProvider } from "@/providers/theme-provider"
import { GeistSans } from "geist/font/sans"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
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
  const messages = await getMessages()
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <NextIntlClientProvider messages={messages}>
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
      </NextIntlClientProvider>
    </html>
  )
}
