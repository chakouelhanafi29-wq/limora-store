import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:\\Users\\J.P.M\\.cursor\\projects\\c-Users-J-P-M-OneDrive-Bureau-barnd-ai\\assets";

const outputDir = resolve(process.cwd(), "public/reviews");

const images = [
  { input: "review-noura-alotaibi.png", output: "noura-alotaibi.webp" },
  { input: "review-fatima-aldosari.png", output: "fatima-aldosari.webp" },
  { input: "review-maryam-alqahtani.png", output: "maryam-alqahtani.webp" },
  { input: "review-sara-alharbi.png", output: "sara-alharbi.webp" },
  { input: "review-lama-alshammari.png", output: "lama-alshammari.webp" },
  { input: "review-hind-alzahrani.png", output: "hind-alzahrani.webp" },
];

await mkdir(outputDir, { recursive: true });

for (const image of images) {
  const inputPath = resolve(assetsDir, image.input);
  const outputPath = resolve(outputDir, image.output);

  await sharp(inputPath)
    .rotate()
    .resize({ width: 400, height: 400, fit: "cover" })
    .webp({ quality: 86, effort: 6 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`${image.output} → ${meta.width}x${meta.height}`);
}

for (const [source, target] of [
  ["review-sara-alharbi.png", "reem-alqahtani.webp"],
  ["review-maryam-alqahtani.png", "dana-almutairi.webp"],
]) {
  const inputPath = resolve(assetsDir, source);
  const outputPath = resolve(outputDir, target);
  await sharp(inputPath)
    .rotate()
    .resize({ width: 400, height: 400, fit: "cover" })
    .webp({ quality: 86, effort: 6 })
    .toFile(outputPath);
  console.log(`${target} → derived`);
}

console.log("\nReview avatars ready in public/reviews/");
