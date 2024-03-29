const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
})

async function main() {

  for (let i = 0; i < 10; i++) {

    await prisma.with_all_relation_types.create({
      data: {
        id: i,
        name: `with_all_relation_types ${String(i)}`,
      },
    });

    await prisma.with_compound_unique.create({
      data: {
        id: i,
        name: `with_compound_unique ${String(i)}`,
      },
    });

  }

  await prisma.with_all_relation_types.update({
    where: { id: 0 },
    data: {
      to_compound_unique: {
        connect: { id_name: { id: 2, name: "with_compound_unique 2" } },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })