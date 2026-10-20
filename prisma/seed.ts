import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import * as pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// "Super Admin" dibuat lebih dulu supaya konsisten dapat id=1 di DB baru —
// PermissionsGuard pakai role.id === 1 sebagai salah satu fallback bypass.
const ROLES = ["Super Admin", "Sales"];

// Master data: hanya Super Admin (bypass di PermissionsGuard).
const MASTER_PERMISSIONS = [
  "employee:write",
  "market-area:write",
  "vehicle:write",
  "price-type:write",
  "outlet:write",
  "product:write",
  "product-price:write",
  "warehouse:write",
];

// Transaksi kanvas: boleh dikerjakan role Sales.
const TRANSACTION_PERMISSIONS = [
  "sales-kanvas-plan:write",
  "kasbon-product:write",
  "kasbon-operational:write",
  "product-out:write",
  "product-in:write",
  "invoice-outlet:write",
  "invoice-payment:write",
  "invoice-return:write",
];

// Permission lama yang controller-nya sudah tidak ada.
const OBSOLETE_PERMISSIONS = [
  "plan:read",
  "plan:write",
  "kasbon-material-type:write",
];

async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Bersihkan permission lama (relasi permission_role ikut terhapus via cascade).
  await prisma.permission.deleteMany({
    where: { name: { in: OBSOLETE_PERMISSIONS } },
  });

  // Semua permission baru dibuat, tidak hanya milik Sales.
  for (const name of [...MASTER_PERMISSIONS, ...TRANSACTION_PERMISSIONS]) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Role Sales boleh menulis data transaksi kanvas
  // (Super Admin bypass di PermissionsGuard).
  const sales = await prisma.role.findUniqueOrThrow({
    where: { name: "Sales" },
  });
  for (const name of TRANSACTION_PERMISSIONS) {
    const perm = await prisma.permission.findUniqueOrThrow({ where: { name } });
    await prisma.permissionRole.upsert({
      where: {
        permission_id_role_id: { permission_id: perm.id, role_id: sales.id },
      },
      update: {},
      create: { permission_id: perm.id, role_id: sales.id },
    });
  }

  const username = process.env.SEED_USERNAME ?? "sales";
  const password = process.env.SEED_PASSWORD ?? "password";
  const roleName = process.env.SEED_ROLE ?? "Sales";

  const role = await prisma.role.findUniqueOrThrow({
    where: { name: roleName },
  });

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: await bcrypt.hash(password, 10),
      name: "Nama Sales Admin",
      role_id: role.id,
    },
  });

  console.log(`Seeded roles: ${ROLES.join(", ")}`);
  console.log(
    `Seeded permissions: ${MASTER_PERMISSIONS.length + TRANSACTION_PERMISSIONS.length}`,
  );
  console.log(`Seeded user: ${user.username} (role: ${roleName})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());