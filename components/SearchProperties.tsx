"use client"

import { Form, Input, Select, Space } from "antd"
import React from "react"

export default function SearchProperties() {
  return (
    <div className="flex-center px-1">
      <Form>
        <Space.Compact>
          <Form.Item name="type">
            <Select
              defaultValue={"RENT"}
              options={[
                {
                  value: "RENT",
                  label: "For Rent",
                },
                {
                  value: "SALE",
                  label: "For Sale",
                },
              ]}
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>
          <Form.Item name={"location"}>
            <Input.Search
              size="large"
              enterButton="Search"
              placeholder="Search for a location..."
            />
          </Form.Item>
        </Space.Compact>
      </Form>
    </div>
  )
}
