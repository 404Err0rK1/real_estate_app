"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const error = searchParams.get("error")

    console.log("error")
    if (error === "login_required") {
      window.alert("Please signin to access this page")
    }
  }, [searchParams])
  return <>{children}</>
}
