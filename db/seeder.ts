import {
  BHK,
  Parking,
  PreferredTenants,
  PropertyType,
  Type,
} from "@prisma/client"
import { db } from "."
import properties from "@/data/properties.json"

const importData = async () => {
  try {
    await db.property.deleteMany()
    await db.images.deleteMany()

    for (const property of properties) {
      let owner = await db.user.findUnique({
        where: {
          email: property.owner.email,
        },
      })

      if (!owner) {
        owner = await db.user.create({
          data: {
            username: property.owner.username,
            email: property.owner.email,
          },
        })
      }
      await db.property.create({
        data: {
          type: property.type as Type,
          name: property.name,
          description: property.description,
          street: property.street,
          city: property.city,
          state: property.state,
          zipcode: property.zipcode,
          price: property.price,
          bhk: property.bhk as BHK,
          area: property.area,
          parking: property.parking as Parking,
          preferredTenants: property.preferredTenants as PreferredTenants,
          propertyType: property.propertyType as PropertyType,
          isSold: property.isSold,
          availableFrom: new Date(property.availableFrom),
          ownerId: owner.id,
          images: {
            create: property.images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      })
    }
    console.log("Data imported successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error importing properties", error)
    process.exit(1)
  }
}

if (process.argv.includes("-d")) {
  db.property
    .deleteMany()
    .then(() => db.user.deleteMany())
    .then(() => {
      console.log("Data deleted successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.log("Error destroying data", error)
      process.exit(1)
    })
} else {
  importData()
}
