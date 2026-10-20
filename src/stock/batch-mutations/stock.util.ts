import { Prisma } from '@prisma/client';

export async function getBatchBalance(
  db: Prisma.TransactionClient,
  where: { warehouse_id: number; product_id: number; batch: string },
) {
  const rows = await db.batchMutation.groupBy({
    by: ['direction'],
    where,
    _sum: { qty: true },
  });
  const sum = (dir: string) =>
    rows.find((r) => r.direction === dir)?._sum.qty ?? 0;
  return sum('IN') - sum('OUT');
}