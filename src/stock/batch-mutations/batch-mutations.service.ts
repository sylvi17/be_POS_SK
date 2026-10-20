import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BatchMutationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(warehouseId?: number, productId?: number, batch?: string) {
    return this.prisma.batchMutation.findMany({
      where: { warehouse_id: warehouseId, product_id: productId, batch },
      include: { product: { select: { id: true, code: true, name: true } } },
      orderBy: { id: 'desc' },
      take: 500,
    });
  }

  async balance(warehouseId: number) {
    const rows = await this.prisma.batchMutation.groupBy({
      by: ['product_id', 'batch', 'direction'],
      where: { warehouse_id: warehouseId },
      _sum: { qty: true },
    });

    const map = new Map<
      string,
      { product_id: number; batch: string; qty: number }
    >();
    for (const r of rows) {
      const key = `${r.product_id}|${r.batch}`;
      const item = map.get(key) ?? {
        product_id: r.product_id,
        batch: r.batch,
        qty: 0,
      };
      item.qty += (r.direction === 'IN' ? 1 : -1) * (r._sum.qty ?? 0);
      map.set(key, item);
    }
    return [...map.values()].filter((i) => i.qty !== 0);
  }
}