import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let arr: { title: string; description: string; userId: string }[] = [];
  for (let i = 0; i < 100; i++) {
    const title = `Title ${i}`;
    const description = `Description ${i}`;

    arr = [
      ...arr,
      { title, description, userId: '0375e9a1-6fb4-4143-bca6-c7e1bf5aec6b' },
    ];
  }
  await prisma.note.createMany({
    data: [...arr],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
