const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const plainPassword = "82471129qwe"; // password baru

  console.log(`🔍 Mengecek keberadaan admin dengan email: ${email} ...`);

  const existing = await prisma.user.findFirst({ where: { email } });
  const hashed = await bcrypt.hash(plainPassword, 10);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hashed, role: "admin" },
    });
    console.log("✅ Admin ditemukan dan password berhasil diperbarui!");
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "admin",
      },
    });
    console.log("✅ Admin baru berhasil dibuat!");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("🚨 Terjadi error:", err);
  process.exit(1);
});
