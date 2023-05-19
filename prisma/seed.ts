import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  for (let i = 1; i <= 5; i += 1) {
    await prisma.user.create({
      data: {
        id: i,
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
    });
  }

  for (let i = 1; i <= 100; i += 1) {
    await prisma.book.create({
      data: {
        id: i,
        title: faker.word.words({ count: { min: 1, max: 3 } }).toLowerCase(),
        author: faker.person.fullName().toLowerCase(),
      },
    });
  }

  for (let i = 1; i <= 50; i += 1) {
    const userId = faker.number.int({ min: 1, max: 5 });
    const bookId = faker.number.int({ min: 1, max: 100 });
    await prisma.userBook.upsert({
      create: {
        userId,
        bookId,
        status: faker.helpers.arrayElement(["READ", "READING", "TO_READ"]),
        date: faker.date.past(),
      },
      update: {},
      where: { userId_bookId: { userId, bookId } },
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
