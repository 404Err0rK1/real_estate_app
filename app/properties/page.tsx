"use client"

import { getProperties } from "@/actions"
import PropertyCards from "@/components/PropertyCards"
import { PropertyWithImages } from "@/db"
import { FilterValues } from "@/types"
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Radio,
  Row,
  Select,
} from "antd"
import React, { useEffect, useState } from "react"
import { LoadingOutlined } from "@ant-design/icons"

export default function Properties() {
  const [sortOrder, setSortOrder] = useState("latest")
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [propertyCount, setPropertyCount] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [filterForm] = Form.useForm()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const properties = await getProperties(
          filters,
          sortOrder,
          propertyCount
        )
        setProperties(properties)
      } catch (error) {
        console.error("Error fetching Properties", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [filters, sortOrder, propertyCount])
  console.log(filters)

  return (
    <div className="container">
      <h1 className="heading">Properties</h1>
      <Breadcrumb
        className="flex-center"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Properties",
          },
        ]}
      />
      <div className="sticky-container mt-1">
        <Row gutter={[16, 16]} wrap>
          <Col xs={24} md={8} className="sticky-column">
            <Card title="Filters">
              <Form form={filterForm} onFinish={(values) => setFilters(values)}>
                <Form.Item name={"type"}>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value={"RENT"}> Rent</Radio.Button>
                    <Radio.Button value={"SALE"}> Sale</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={"apartment_type"}>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value={"APARTMENT"}> Apartment</Radio.Button>
                    <Radio.Button value={"INDEPENDENT"}>
                      {" "}
                      Independent
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={"bhk"}>
                  <Checkbox.Group>
                    <Checkbox value="ONE_RK">1RK</Checkbox>
                    <Checkbox value="ONE_BHK">1BHK</Checkbox>
                    <Checkbox value="TWO_BHK">2BHK</Checkbox>
                    <Checkbox value="THREE_BHK">3BHK</Checkbox>
                    <Checkbox value="FOUR_BHK">4BHK</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item label="Price" name={"price"}>
                  <Select
                    className="w-full"
                    placeholder="Select price range"
                    options={[
                      { label: "0 - 10,000", value: "0-10000" },
                      { label: "10,000 - 20,000", value: "10000-20000" },
                      { label: "20,000 - 30,000", value: "20000-30000" },
                      { label: "30,000 - 40,000", value: "30000-40000" },
                      { label: "40,000 - 50,000", value: "40000-50000" },
                      { label: "50,000 - 1L", value: "50000-100000" },
                      { label: "1L - 5L", value: "100000-500000" },
                      { label: "5L - 10L", value: "500000-1000000" },
                      { label: "10L - 20L", value: "1000000-2000000" },
                      { label: "20L - 50L", value: "2000000-5000000" },
                      { label: "50L - 1Cr", value: "5000000-10000000" },
                      { label: "1Cr - 5Cr", value: "10000000-50000000" },
                      { label: "5Cr - 10Cr", value: "50000000-100000000" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Area" name={"area"}>
                  <Select
                    className="w-full"
                    placeholder="Select area range"
                    options={[
                      { label: "0 - 500", value: "0-500" },
                      { label: "500 - 1000", value: "500-1000" },
                      { label: "1000 - 1500", value: "1000-1500" },
                      { label: "1500 - 2000", value: "1500-2000" },
                      { label: "2000 - 2500", value: "2000-2500" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={"preferred_tenants"}>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value={"FAMILY"}> Family</Radio.Button>
                    <Radio.Button value={"BACHELOR"}> Bachelor</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Divider />
                <Flex justify="flex-end" gap={8}>
                  <Button onClick={() => filterForm.resetFields()}>
                    Reset
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Flex>
              </Form>
            </Card>
          </Col>
          <Col xs={24} md={16} className="scrollable-column">
            <Form.Item label="Sort By" name={"sort_by"} className="mb-1">
              <Select
                defaultValue={"latest"}
                placeholder="Sort By"
                style={{ width: 200 }}
                onChange={(value) => setSortOrder(value)}
                options={[
                  { label: "Latest", value: "latest" },
                  { label: "Price: Low to High", value: "asc" },
                  { label: "Price: High to Low", value: "desc" },
                ]}
              />
            </Form.Item>
            <PropertyCards layout={"horizontal"} properties={properties} />
            {loading && <LoadingOutlined className="loading" />}
            <Button
              type="primary"
              block
              className="mt-1"
              onClick={() => setPropertyCount((prev) => prev + 10)}
            >
              Load More
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
