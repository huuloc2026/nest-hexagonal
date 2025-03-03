import { PrismaClient, Role, Category, OrderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the correct order
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany(); // Delete reviews before products
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminSalt = await bcrypt.genSalt();
  const adminPassword = await bcrypt.hash('admin123', adminSalt);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      salt: adminSalt,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  // Create regular users
  const users = await Promise.all(
    Array(20)
      .fill(null)
      .map(async () => {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('password123', salt);
        return prisma.user.create({
          data: {
            email: faker.internet.email().toLowerCase(),
            password,
            salt,
            name: faker.person.fullName(),
            role: Role.USER,
            address: {
              create: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                zipCode: faker.location.zipCode(),
              },
            },
          },
        });
      }),
  );

  // Create products with variants
  const products = await Promise.all([
    // Rackets
    ...Array(20)
      .fill(null)
      .map(() =>
        prisma.product.create({
          data: {
            name: `${faker.commerce.productAdjective()} Tennis Racket`,
            description: faker.commerce.productDescription(),
            price: faker.number.float({ min: 99, max: 299 }),
            stock: faker.number.int({ min: 10, max: 50 }),
            category: Category.RACKET,
            variants: {
              create: [
                {
                  color: faker.color.human(),
                  weight: faker.number.float({ min: 280, max: 320 }),
                  stock: faker.number.int({ min: 5, max: 20 }),
                },
                {
                  color: faker.color.human(),
                  weight: faker.number.float({ min: 280, max: 320 }),
                  stock: faker.number.int({ min: 5, max: 20 }),
                },
              ],
            },
          },
        }),
      ),
    // Balls
    ...Array(5)
      .fill(null)
      .map(() =>
        prisma.product.create({
          data: {
            name: `${faker.commerce.productAdjective()} Badminton Balls`,
            description: faker.commerce.productDescription(),
            price: faker.number.float({ min: 5, max: 15 }),
            stock: faker.number.int({ min: 50, max: 200 }),
            category: Category.BALL,
          },
        }),
      ),
    // Shoes
    ...Array(15)
      .fill(null)
      .map(() =>
        prisma.product.create({
          data: {
            name: `${faker.commerce.productAdjective()} Tennis Shoes`,
            description: faker.commerce.productDescription(),
            price: faker.number.float({ min: 59, max: 159 }),
            stock: faker.number.int({ min: 20, max: 100 }),
            category: Category.SHOES,
            variants: {
              create: Array(3)
                .fill(null)
                .map(() => ({
                  color: faker.color.human(),
                  size: faker.helpers.arrayElement([
                    '40',
                    '41',
                    '42',
                    '43',
                    '44',
                    '45',
                  ]),
                  stock: faker.number.int({ min: 5, max: 30 }),
                })),
            },
          },
        }),
      ),
    ...Array(10)
      .fill(null)
      .map(() =>
        prisma.product.create({
          data: {
            name: `${faker.commerce.productAdjective()} Badminton Shoes`,
            description: faker.commerce.productDescription(),
            price: faker.number.float({ min: 59, max: 159 }),
            stock: faker.number.int({ min: 20, max: 100 }),
            category: Category.SHOES,
            variants: {
              create: Array(3)
                .fill(null)
                .map(() => ({
                  color: faker.color.human(),
                  size: faker.helpers.arrayElement([
                    '40',
                    '41',
                    '42',
                    '43',
                    '44',
                    '45',
                  ]),
                  stock: faker.number.int({ min: 5, max: 30 }),
                })),
            },
          },
        }),
      ),
  ]);

  // Create reviews
  await Promise.all(
    products.flatMap((product) =>
      Array(faker.number.int({ min: 1, max: 5 }))
        .fill(null)
        .map(() =>
          prisma.review.create({
            data: {
              userId: faker.helpers.arrayElement(users).id,
              productId: product.id,
              rating: faker.number.int({ min: 3, max: 5 }),
              comment: faker.helpers.maybe(() => faker.lorem.paragraph(), {
                probability: 0.7,
              }),
            },
          }),
        ),
    ),
  );

  // Create orders
  await Promise.all(
    users.flatMap((user) =>
      Array(faker.number.int({ min: 1, max: 4 }))
        .fill(null)
        .map(async () => {
          const orderItems = await Promise.all(
            Array(faker.number.int({ min: 1, max: 5 }))
              .fill(null)
              .map(async () => {
                const product = faker.helpers.arrayElement(products);
                const quantity = faker.number.int({ min: 1, max: 3 });
                return {
                  productId: product.id,
                  quantity,
                  price: product.price,
                };
              }),
          );

          const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price.toNumber() * item.quantity,
            0,
          );

          return prisma.order.create({
            data: {
              userId: user.id,
              totalAmount,
              status: faker.helpers.arrayElement(Object.values(OrderStatus)),
              items: {
                create: orderItems,
              },
            },
          });
        }),
    ),
  );

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
