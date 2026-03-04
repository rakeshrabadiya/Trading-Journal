import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const exist = await prisma.user.findUnique({
      where: { email: "Aqua12@gmail.com" },
    });
    console.log("exist:", exist);

    const user = await prisma.user.create({
      data: {
        email: "Aqua12@gmail.com",
        password: "hashedpassword",
        name: "AQuaMarine"
      }
    });
    console.log("Created user:", user);
  } catch (e) {
    console.error("Prisma error:", e);
  }
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
