"use client"

import { postProperty } from "@/actions"
import { Property } from "@prisma/client"
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Upload,
} from "antd"
import { useSession } from "next-auth/react"
import { PlusOutlined } from "@ant-design/icons"
import React, { useState } from "react"
import type { GetProp, UploadFile, UploadProps } from "antd"
import { RcFile } from "antd/es/upload"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

export default function AddProperty() {
  const { data: session } = useSession()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  console.log(fileList)

  const onFinish = async (values: Property) => {
    const getBase64 = (file: FileType): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
      })
    try {
      const base64Images = await Promise.all(
        fileList.map((file) => {
          const fileToConvert = file.originFileObj as RcFile
          return getBase64(fileToConvert)
        })
      )
      const response = await postProperty(
        values,
        session?.user?.id as string,
        base64Images
      )
      console.log(response)
    } catch (error) {
      console.log("Error creating property", error)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  return (
    <div className="formContainer">
      <h1 className="heading">List Your Property</h1>
      <p className="paragraph mb-1 text-center">
        List your property for free and reach out to our potential buyers and
        sellers.
      </p>
      <Form
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Card>
          <Form.Item
            label="Type"
            name={"type"}
            rules={[
              {
                required: true,
                message: "Please input the property type",
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={"RENT"}>Rent</Radio.Button>
              <Radio.Button value={"SALE"}>Sale</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[
              {
                required: true,
                message: "Please input the property name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Street"
            name={"street"}
            rules={[
              {
                required: true,
                message: "Please input the property street",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name={"city"}
            rules={[
              {
                required: true,
                message: "Please input the property city",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name={"state"}
            rules={[
              {
                required: true,
                message: "Please input the property state",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zipcode"
            name={"zipcode"}
            rules={[
              {
                required: true,
                message: "Please input the property zipcode",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name={"price"}
            rules={[
              {
                required: true,
                message: "Please input the property price",
              },
            ]}
          >
            <InputNumber addonBefore={"Rs"} />
          </Form.Item>
          <Form.Item
            label="BHK"
            name={"bhk"}
            rules={[
              {
                required: true,
                message: "Please input the property BHK",
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="ONE_RK">1RK</Radio.Button>
              <Radio.Button value="ONE_BHK">1BHK</Radio.Button>
              <Radio.Button value="TWO_BHK">2BHK</Radio.Button>
              <Radio.Button value="THREE_BHK">3BHK</Radio.Button>
              <Radio.Button value="FOUR_BHK">4BHK</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Area"
            name={"area"}
            rules={[
              {
                required: true,
                message: "Please input the property area",
              },
            ]}
          >
            <InputNumber addonAfter={"sqft"} />
          </Form.Item>
          <Form.Item
            label="Parking"
            name={"parking"}
            rules={[
              {
                required: true,
                message: "Please input the property parking",
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={"YES"}>Yes</Radio.Button>
              <Radio.Button value={"NO"}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Upload Images" valuePropName="fileList">
            <Upload
              multiple
              listType="picture-card"
              beforeUpload={() => false}
              onChange={onChange}
              onPreview={handlePreview}
              fileList={fileList}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Preferred Tenants"
            name={"preferredTenants"}
            rules={[
              {
                required: true,
                message: "Please input the property preferred tenants",
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={"FAMILY"}>Family</Radio.Button>
              <Radio.Button value={"BACHELORS"}>Bachelors</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Property Type"
            name={"propertyType"}
            rules={[
              {
                required: true,
                message: "Please input the property type",
              },
            ]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
              <Radio.Button value={"INDEPENDENT"}>Independent</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Available From"
            name={"availableFrom"}
            rules={[
              {
                required: true,
                message: "Please input the Available From",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button>Reset</Button>
          </Space>
        </Card>
      </Form>
    </div>
  )
}
