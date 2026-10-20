/*
  Warnings:

  - You are about to drop the `ms_employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_kanvas_kasbon_material_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_market_area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_kasbon_material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_personil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_plan_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_kasbon_material" DROP CONSTRAINT "ts_sales_kanvas_kasbon_material_kasbon_material_type_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_kasbon_material" DROP CONSTRAINT "ts_sales_kanvas_kasbon_material_sales_kanvas_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_personil" DROP CONSTRAINT "ts_sales_kanvas_personil_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_personil" DROP CONSTRAINT "ts_sales_kanvas_personil_sales_kanvas_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan" DROP CONSTRAINT "ts_sales_kanvas_plan_market_area_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan" DROP CONSTRAINT "ts_sales_kanvas_plan_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan_detail" DROP CONSTRAINT "ts_sales_kanvas_plan_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan_detail" DROP CONSTRAINT "ts_sales_kanvas_plan_detail_sales_kanvas_plan_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "id_karyawan" INTEGER;

-- DropTable
DROP TABLE "ms_employee";

-- DropTable
DROP TABLE "ms_kanvas_kasbon_material_type";

-- DropTable
DROP TABLE "ms_market_area";

-- DropTable
DROP TABLE "ms_product";

-- DropTable
DROP TABLE "ms_vehicle";

-- DropTable
DROP TABLE "ts_sales_kanvas_kasbon_material";

-- DropTable
DROP TABLE "ts_sales_kanvas_personil";

-- DropTable
DROP TABLE "ts_sales_kanvas_plan";

-- DropTable
DROP TABLE "ts_sales_kanvas_plan_detail";

-- CreateTable
CREATE TABLE "karyawan" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT,
    "no_hp" TEXT,
    "aktif" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wilayah_kanvas" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "wilayah_kanvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kendaraan" (
    "id" SERIAL NOT NULL,
    "plat_nomor" TEXT NOT NULL,
    "jenis" TEXT,
    "keterangan" TEXT,
    "aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "kendaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipe_harga" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "tipe_harga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlet" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "no_hp" TEXT,
    "id_wilayah_kanvas" INTEGER,
    "id_tipe_harga" INTEGER NOT NULL,
    "limit_piutang" DECIMAL(15,2) DEFAULT 0,
    "aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "satuan" TEXT,
    "aktif" BOOLEAN DEFAULT true,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_harga" (
    "id" SERIAL NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_tipe_harga" INTEGER NOT NULL,
    "harga" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "produk_harga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gudang" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "gudang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rencana_kanvas" (
    "id" SERIAL NOT NULL,
    "no_rencana" TEXT NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "id_kendaraan" INTEGER,
    "id_wilayah_kanvas" INTEGER,
    "tgl_berangkat" DATE NOT NULL,
    "tgl_pulang" DATE,

    CONSTRAINT "rencana_kanvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_rencana_kanvas" (
    "id" SERIAL NOT NULL,
    "id_rencana_kanvas" INTEGER NOT NULL,
    "id_outlet" INTEGER NOT NULL,

    CONSTRAINT "detail_rencana_kanvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kasbon_produk" (
    "id" SERIAL NOT NULL,
    "no_kasbon" TEXT NOT NULL,
    "id_rencana_kanvas" INTEGER NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kasbon_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_kasbon_produk" (
    "id" SERIAL NOT NULL,
    "id_kasbon_produk" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(15,2),

    CONSTRAINT "detail_kasbon_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kasbon_operasional" (
    "id" SERIAL NOT NULL,
    "no_kasbon" TEXT NOT NULL,
    "id_rencana_kanvas" INTEGER NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jumlah" DECIMAL(15,2) NOT NULL,
    "keperluan" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kasbon_operasional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_out" (
    "id" SERIAL NOT NULL,
    "no_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "id_rencana_kanvas" INTEGER,
    "id_kasbon_produk" INTEGER,
    "keterangan" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produk_out_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_produk_out" (
    "id" SERIAL NOT NULL,
    "id_produk_out" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "batch" TEXT,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "detail_produk_out_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_in" (
    "id" SERIAL NOT NULL,
    "no_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "id_rencana_kanvas" INTEGER,
    "keterangan" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produk_in_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_produk_in" (
    "id" SERIAL NOT NULL,
    "id_produk_in" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "batch" TEXT,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "detail_produk_in_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutasi_batch" (
    "id" SERIAL NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "id_rencana_kanvas" INTEGER,
    "id_detail_produk_out" INTEGER,
    "id_detail_produk_in" INTEGER,
    "batch" TEXT NOT NULL,
    "arah" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "mutasi_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_outlet" (
    "id" SERIAL NOT NULL,
    "no_invoice" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "id_rencana_kanvas" INTEGER,
    "tipe_pembayaran" TEXT NOT NULL,
    "top_hari" INTEGER DEFAULT 0,
    "tgl_jatuh_tempo" DATE,
    "total" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "invoice_outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_invoice_outlet" (
    "id" SERIAL NOT NULL,
    "id_invoice_outlet" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "batch" TEXT,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(15,2) NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "detail_invoice_outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_retur_produk" (
    "id" SERIAL NOT NULL,
    "no_retur" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "id_invoice_outlet" INTEGER,
    "id_gudang" INTEGER,
    "total" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "invoice_retur_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_invoice_retur_produk" (
    "id" SERIAL NOT NULL,
    "id_invoice_retur_produk" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "batch" TEXT,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(15,2) NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "detail_invoice_retur_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran_invoice" (
    "id" SERIAL NOT NULL,
    "id_invoice_outlet" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jumlah" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "pembayaran_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kartu_piutang_outlet" (
    "id" SERIAL NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "id_invoice_outlet" INTEGER NOT NULL,
    "id_pembayaran_invoice" INTEGER,
    "tanggal" DATE NOT NULL,
    "sisa" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "kartu_piutang_outlet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_kode_key" ON "karyawan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "wilayah_kanvas_kode_key" ON "wilayah_kanvas"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "kendaraan_plat_nomor_key" ON "kendaraan"("plat_nomor");

-- CreateIndex
CREATE UNIQUE INDEX "outlet_kode_key" ON "outlet"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "produk_kode_key" ON "produk"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "produk_harga_id_produk_id_tipe_harga_key" ON "produk_harga"("id_produk", "id_tipe_harga");

-- CreateIndex
CREATE UNIQUE INDEX "gudang_kode_key" ON "gudang"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "rencana_kanvas_no_rencana_key" ON "rencana_kanvas"("no_rencana");

-- CreateIndex
CREATE UNIQUE INDEX "kasbon_produk_no_kasbon_key" ON "kasbon_produk"("no_kasbon");

-- CreateIndex
CREATE UNIQUE INDEX "kasbon_operasional_no_kasbon_key" ON "kasbon_operasional"("no_kasbon");

-- CreateIndex
CREATE UNIQUE INDEX "produk_out_no_transaksi_key" ON "produk_out"("no_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "produk_in_no_transaksi_key" ON "produk_in"("no_transaksi");

-- CreateIndex
CREATE INDEX "mutasi_batch_id_produk_id_gudang_batch_idx" ON "mutasi_batch"("id_produk", "id_gudang", "batch");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_outlet_no_invoice_key" ON "invoice_outlet"("no_invoice");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_retur_produk_no_retur_key" ON "invoice_retur_produk"("no_retur");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlet" ADD CONSTRAINT "outlet_id_wilayah_kanvas_fkey" FOREIGN KEY ("id_wilayah_kanvas") REFERENCES "wilayah_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlet" ADD CONSTRAINT "outlet_id_tipe_harga_fkey" FOREIGN KEY ("id_tipe_harga") REFERENCES "tipe_harga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_harga" ADD CONSTRAINT "produk_harga_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_harga" ADD CONSTRAINT "produk_harga_id_tipe_harga_fkey" FOREIGN KEY ("id_tipe_harga") REFERENCES "tipe_harga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_kendaraan_fkey" FOREIGN KEY ("id_kendaraan") REFERENCES "kendaraan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_wilayah_kanvas_fkey" FOREIGN KEY ("id_wilayah_kanvas") REFERENCES "wilayah_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_rencana_kanvas" ADD CONSTRAINT "detail_rencana_kanvas_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_rencana_kanvas" ADD CONSTRAINT "detail_rencana_kanvas_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_produk" ADD CONSTRAINT "kasbon_produk_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_produk" ADD CONSTRAINT "kasbon_produk_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kasbon_produk" ADD CONSTRAINT "detail_kasbon_produk_id_kasbon_produk_fkey" FOREIGN KEY ("id_kasbon_produk") REFERENCES "kasbon_produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kasbon_produk" ADD CONSTRAINT "detail_kasbon_produk_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_operasional" ADD CONSTRAINT "kasbon_operasional_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_operasional" ADD CONSTRAINT "kasbon_operasional_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_id_kasbon_produk_fkey" FOREIGN KEY ("id_kasbon_produk") REFERENCES "kasbon_produk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_out" ADD CONSTRAINT "detail_produk_out_id_produk_out_fkey" FOREIGN KEY ("id_produk_out") REFERENCES "produk_out"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_out" ADD CONSTRAINT "detail_produk_out_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_in" ADD CONSTRAINT "produk_in_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_in" ADD CONSTRAINT "produk_in_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_in" ADD CONSTRAINT "produk_in_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_in" ADD CONSTRAINT "detail_produk_in_id_produk_in_fkey" FOREIGN KEY ("id_produk_in") REFERENCES "produk_in"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_in" ADD CONSTRAINT "detail_produk_in_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_detail_produk_out_fkey" FOREIGN KEY ("id_detail_produk_out") REFERENCES "detail_produk_out"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_detail_produk_in_fkey" FOREIGN KEY ("id_detail_produk_in") REFERENCES "detail_produk_in"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_outlet" ADD CONSTRAINT "invoice_outlet_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_outlet" ADD CONSTRAINT "invoice_outlet_id_rencana_kanvas_fkey" FOREIGN KEY ("id_rencana_kanvas") REFERENCES "rencana_kanvas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_outlet" ADD CONSTRAINT "detail_invoice_outlet_id_invoice_outlet_fkey" FOREIGN KEY ("id_invoice_outlet") REFERENCES "invoice_outlet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_outlet" ADD CONSTRAINT "detail_invoice_outlet_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_retur_produk" ADD CONSTRAINT "invoice_retur_produk_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_retur_produk" ADD CONSTRAINT "invoice_retur_produk_id_invoice_outlet_fkey" FOREIGN KEY ("id_invoice_outlet") REFERENCES "invoice_outlet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_retur_produk" ADD CONSTRAINT "invoice_retur_produk_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_retur_produk" ADD CONSTRAINT "detail_invoice_retur_produk_id_invoice_retur_produk_fkey" FOREIGN KEY ("id_invoice_retur_produk") REFERENCES "invoice_retur_produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_retur_produk" ADD CONSTRAINT "detail_invoice_retur_produk_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_invoice" ADD CONSTRAINT "pembayaran_invoice_id_invoice_outlet_fkey" FOREIGN KEY ("id_invoice_outlet") REFERENCES "invoice_outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kartu_piutang_outlet" ADD CONSTRAINT "kartu_piutang_outlet_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kartu_piutang_outlet" ADD CONSTRAINT "kartu_piutang_outlet_id_invoice_outlet_fkey" FOREIGN KEY ("id_invoice_outlet") REFERENCES "invoice_outlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kartu_piutang_outlet" ADD CONSTRAINT "kartu_piutang_outlet_id_pembayaran_invoice_fkey" FOREIGN KEY ("id_pembayaran_invoice") REFERENCES "pembayaran_invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
