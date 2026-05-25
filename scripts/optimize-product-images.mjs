import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:\\Users\\J.P.M\\.cursor\\projects\\c-Users-J-P-M-OneDrive-Bureau-barnd-ai\\assets";

const outputDir = resolve(process.cwd(), "public/products/collagen-glow");

const sources = [
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_25______2026__10_47_46__-6c431c81-7223-4a4b-ba15-5a674be59d1f.png",
    output: "01-before-after-hero.webp",
    width: 1400,
  },
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_25______2026__10_55_04__-175640de-67c3-4ae9-9f49-d3d6ef5523bf.png",
    output: "02-lifestyle-hijabi.webp",
    width: 1200,
  },
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_25______2026__11_02_17__-0d2cdcd8-02ac-429f-bbe6-f6f73ea40ea8.png",
    output: "03-benefits-infographic.webp",
    width: 1200,
  },
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_25______2026__10_49_49__-7b978809-62b4-4777-9c1e-5930d3c209cb.png",
    output: "04-transformation.webp",
    width: 1400,
  },
];

await mkdir(outputDir, { recursive: true });

for (const file of ["hero.png", "lifestyle.png", "benefits.png", "transformation.png"]) {
  await rm(resolve(outputDir, file), { force: true });
}

for (const source of sources) {
  const inputPath = resolve(assetsDir, source.input);
  const outputPath = resolve(outputDir, source.output);

  await sharp(inputPath)
    .rotate()
    .resize({ width: source.width, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`${source.output} → ${meta.width}x${meta.height}`);
}

console.log("\nOptimized gallery ready in public/products/collagen-glow/");
