import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.food.createMany({
    data: [
      { name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 3 },
      { name: 'Arroz blanco cocido', calories: 130, protein: 2, carbs: 28, fat: 0.3 },
      { name: 'Avena', calories: 389, protein: 17, carbs: 66, fat: 7 },
      { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
      { name: 'Almendras', calories: 576, protein: 21, carbs: 22, fat: 49 },
      { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13 },
      { name: 'Huevo', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
      { name: 'Brócoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
      { name: 'Quinoa cocida', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
      { name: 'Yogur griego', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
      { name: 'Boniato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
      { name: 'Atún en agua', calories: 132, protein: 28, carbs: 0, fat: 1 },
      { name: 'Lentejas cocidas', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
      { name: 'Crema de cacahuete', calories: 588, protein: 25, carbs: 20, fat: 50 },
      { name: 'Espinacas', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
      { name: 'Manzana', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
      { name: 'Requesón', calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
      { name: 'Proteína whey', calories: 120, protein: 24, carbs: 3, fat: 2 },
      { name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fat: 15 }
    ],
    skipDuplicates: true
  });

  await prisma.exercise.createMany({
    data: [
      { name: 'Sentadilla trasera', category: 'Piernas', equipment: 'Barra' },
      { name: 'Press banca', category: 'Empuje', equipment: 'Barra' },
      { name: 'Peso muerto convencional', category: 'Tirón', equipment: 'Barra' },
      { name: 'Remo con barra', category: 'Tirón', equipment: 'Barra' },
      { name: 'Dominadas', category: 'Tirón', equipment: 'Peso corporal' },
      { name: 'Press militar', category: 'Empuje', equipment: 'Barra' },
      { name: 'Hip thrust', category: 'Piernas', equipment: 'Barra' },
      { name: 'Curl bíceps', category: 'Accesorio', equipment: 'Mancuernas' },
      { name: 'Extensión tríceps', category: 'Accesorio', equipment: 'Polea' }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
