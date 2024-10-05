"use client"

import React, { useEffect, useState } from "react"
import logo from "@/public/images/logo.png"
import { Button, Divider, Dropdown, Flex, MenuProps } from "antd"
import { GoogleOutlined } from "@ant-design/icons"
import SearchProperties from "./SearchProperties"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  signOut,
  useSession,
} from "next-auth/react"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Record<
    LiteralUnion<string>,
    ClientSafeProvider
  > | null>(null)

  console.log(session)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [session])

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: () => {
        signOut()
      },
    },
  ]

  return (
    <nav className="nav">
      <div className="flex-between">
        <div
          className="flex-align-center"
          style={{
            gap: 16,
          }}
        >
          <Link href={"/"}>
            <img src={logo.src} alt="logo" width={200} className="pointer" />
          </Link>
          <Link href={"/properties"}>
            <Button ghost>Properties</Button>
          </Link>
        </div>

        {!session && providers && (
          <Button
            icon={<GoogleOutlined />}
            onClick={() => signIn(providers.google.id)}
          >
            Login or Register
          </Button>
        )}
        {session && (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Image
              src={session?.user?.image as string}
              width={40}
              height={40}
              alt={session?.user?.name || "user"}
              className="profile-img"
            />
          </Dropdown>
        )}
      </div>
      {pathname === "/" && (
        <>
          <hr />
          <div className="hero">
            <h1 className="hero-title">
              Finding your <span className="color-sec">perfect home</span>{" "}
            </h1>
            <p className="hero-subtitle">
              Search for your perfect home in the best locations around the
              world
            </p>
            <SearchProperties />
            <Flex justify="center" gap={8}>
              <Link href={"/properties"}>
                <Button>Browse Properties</Button>
              </Link>
              <Link href={"/properties/add"}>
                <Button>List Property</Button>
              </Link>
            </Flex>
          </div>
        </>
      )}
    </nav>
  )
}
