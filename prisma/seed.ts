import { PrismaClient, Role, Category } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      salt,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      salt,
      name: 'Regular User',
      role: Role.USER,
      address: {
        create: {
          street: '123 Main St',
          city: 'Sample City',
          country: 'Sample Country',
          zipCode: '12345',
        },
      },
    },
  });

  // Create products
  const racket = await prisma.product.create({
    data: {
      name: 'Professional Racket',
      description: 'High-quality tennis racket for professional players',
      price: 199.99,
      stock: 50,
      category: Category.RACKET,
      variants: {
        create: [
          {
            color: 'Black',
            weight: 300,
            stock: 30,
          },
          {
            color: 'Blue',
            weight: 300,
            stock: 20,
          },
        ],
      },
    },
  });

  const balls = await prisma.product.create({
    data: {
      name: 'Tennis Balls (3-Pack)',
      description: 'Professional grade tennis balls',
      price: 9.99,
      stock: 100,
      category: Category.BALL,
    },
  });

  const shoes = await prisma.product.create({
    data: {
      name: 'Tennis Shoes',
      description: 'Comfortable tennis shoes with excellent grip',
      price: 89.99,
      stock: 30,
      category: Category.SHOES,
      variants: {
        create: [
          {
            color: 'White',
            size: '42',
            stock: 10,
          },
          {
            color: 'White',
            size: '43',
            stock: 10,
          },
          {
            color: 'White',
            size: '44',
            stock: 10,
          },
        ],
      },
    },
  });

  const shirt = await prisma.product.create({
    data: {
      name: 'Tennis Polo Shirt',
      description: 'Breathable and comfortable tennis shirt',
      price: 39.99,
      stock: 45,
      category: Category.CLOTHING,
      variants: {
        create: [
          {
            color: 'White',
            size: 'S',
            stock: 15,
          },
          {
            color: 'White',
            size: 'M',
            stock: 15,
          },
          {
            color: 'White',
            size: 'L',
            stock: 15,
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
