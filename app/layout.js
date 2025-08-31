import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import Footer from "@/components/footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  title: "AImpress",
  description: "",
};

export default function RootLayout({ children }) {
  // Check if Clerk environment variables are properly configured
  const hasValidClerkConfig = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                              process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  const content = (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if we have valid configuration
  if (hasValidClerkConfig) {
    return (
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  // Return without ClerkProvider if environment variables are not set
  // This allows the app to run in development without Clerk configuration
  return content;
}
