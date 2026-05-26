import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:\\Users\\J.P.M\\.cursor\\projects\\c-Users-J-P-M-OneDrive-Bureau-barnd-ai\\assets";

const publicRoot = resolve(process.cwd(), "public/products");

const products = [
  {
    slug: "collagen-glow",
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_26______2026__03_32_23__-60e35679-17d8-453d-a866-b96f64ec0953.png",
    outputs: [
      { file: "hero.webp", width: 1200 },
      { file: "01-before-after-hero.webp", width: 1400 },
    ],
  },
  {
    slug: "hair-revive",
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_26______2026__03_32_27__-0048ad0a-0aba-4d1d-a2ef-5bc4d0b710f4.png",
    outputs: [{ file: "hero.webp", width: 1200 }],
  },
  {
    slug: "detox-cleanse",
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_26______2026__03_32_32__-6db68857-f302-47ce-a831-b62b20fe10fa.png",
    outputs: [{ file: "hero.webp", width: 1200 }],
  },
];

for (const product of products) {
  const outDir = resolve(publicRoot, product.slug);
  await mkdir(outDir, { recursive: true });
  const inputPath = resolve(assetsDir, product.input);

  for (const output of product.outputs) {
    const outputPath = resolve(outDir, output.file);
    await sharp(inputPath)
      .rotate()
      .resize({ width: output.width, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(outputPath);
    const meta = await sharp(outputPath).metadata();
    console.log(`${product.slug}/${output.file} → ${meta.width}x${meta.height}`);
  }
}

console.log("\nLIMORA product images ready in public/products/");
