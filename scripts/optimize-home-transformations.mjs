import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:\\Users\\J.P.M\\.cursor\\projects\\c-Users-J-P-M-OneDrive-Bureau-barnd-ai\\assets";

const outputDir = resolve(process.cwd(), "public/home/transformations");

const images = [
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_26______2026__04_03_02__-ff8a3e44-d7ef-4f6f-a18a-dc9572e92e8a.png",
    output: "collagen-glow.webp",
    width: 1200,
  },
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_ChatGPT_Image_26______2026__04_03_08__-d4417998-180e-427a-8eba-68255325df64.png",
    output: "hair-revive.webp",
    width: 1200,
  },
  {
    input:
      "c__Users_J.P.M_AppData_Roaming_Cursor_User_workspaceStorage_3aeffe180bed59528f8aa7c711a24367_images_limora_product-177aa94c-b91c-4696-b878-d61d17f53adf.png",
    output: "feminine-balance.webp",
    width: 1200,
  },
];

await mkdir(outputDir, { recursive: true });

for (const image of images) {
  const inputPath = resolve(assetsDir, image.input);
  const outputPath = resolve(outputDir, image.output);

  await sharp(inputPath)
    .rotate()
    .resize({ width: image.width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`${image.output} → ${meta.width}x${meta.height}`);
}

console.log("\nLIMORA homepage transformation images ready.");
