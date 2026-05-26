export type TransformationCardContent = {
  image?: string;
  before?: string;
  after?: string;
  title?: string;
  quote?: string;
  caption?: string;
  resultText?: string;
  days?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function resolveTransformationImage(
  item: TransformationCardContent,
): string {
  return (
    item.image?.trim() ||
    item.after?.trim() ||
    item.before?.trim() ||
    ""
  );
}

export function resolveTransformationTitle(
  item: TransformationCardContent,
): string {
  return item.title?.trim() || "";
}

export function resolveTransformationCaption(
  item: TransformationCardContent,
): string {
  return item.quote?.trim() || item.caption?.trim() || "";
}

export function resolveTransformationResult(
  item: TransformationCardContent,
): string {
  return item.resultText?.trim() || item.days?.trim() || "";
}

export function normalizeTransformationItem(
  item: TransformationCardContent,
): TransformationCardContent {
  const image = resolveTransformationImage(item);
  return {
    image,
    title: resolveTransformationTitle(item),
    caption: resolveTransformationCaption(item),
    resultText: resolveTransformationResult(item),
  };
}
