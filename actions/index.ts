"use server"

import { db } from "@/db"
import { FilterValues } from "@/types"
import cloudinary from "@/utils/cloudinary"
import { Prisma, Property } from "@prisma/client"

async function getProperties(
  filters: FilterValues,
  sortOrder: string,
  propertyCount: number
) {
  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sortOrder === "latest"
      ? { createdAt: "desc" }
      : sortOrder === "asc" || sortOrder === "desc"
      ? { price: sortOrder }
      : (() => {
          throw new Error("Invalid sort order")
        })()
  const filterConditions: Prisma.PropertyWhereInput = {
    type: filters.type as Prisma.EnumTypeFilter,
    propertyType: filters.apartment_type as Prisma.EnumPropertyTypeFilter,
    bhk: (filters.bhk
      ? {
          in: filters.bhk,
        }
      : undefined) as Prisma.EnumBHKFilter,
    price: filters.price
      ? {
          gte: +filters.price.split("-")[0],
          lte: +filters.price.split("-")[1],
        }
      : undefined,
    area: filters.area
      ? {
          gte: +filters.area.split("-")[0],
          lte: +filters.area.split("-")[1],
        }
      : undefined,
    preferredTenants:
      filters.preferred_tenants as Prisma.EnumPreferredTenantsFilter,
    isSold: false,
  }
  console.log(filterConditions)
  try {
    const properties = await db.property.findMany({
      include: {
        images: true,
      },
      take: propertyCount,
      where: filterConditions,
      orderBy,
    })
    return properties
  } catch (error) {
    throw error
    console.error(error)
  }
}

async function postProperty(data: Property, userId: string, images: string[]) {
  const imageUploadPromises = images.map(async (imagesBase64: string) => {
    const result = await cloudinary.uploader.upload(imagesBase64, {
      folder: "easyhomes-yt",
    })
    return result.url
  })
  try {
    const uploadedImages = await Promise.all(imageUploadPromises)
    const response = await db.property.create({
      data: {
        ...data,
        ownerId: +userId,
        images: {
          create: uploadedImages.map((url) => ({ url })),
        },
      },
    })
    return response
  } catch (error) {
    console.log("Error creating property", error)
    throw error
  }
}

export { getProperties, postProperty }
