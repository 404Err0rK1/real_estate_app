import type { Metadata } from "next"
import "./globals.css"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import theme from "@/config/themeConfig"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { rubik } from "@/fonts"
import AuthProvider from "@/components/AuthProvider"
import RequireAuth from "@/components/RequireAuth"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <AuthProvider>
          <ConfigProvider theme={theme}>
            <AntdRegistry>
              <RequireAuth>
                <div className="main-container">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
              </RequireAuth>
            </AntdRegistry>
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
