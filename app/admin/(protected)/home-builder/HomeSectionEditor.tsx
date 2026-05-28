"use client";

import { OFFICIAL_PRODUCT_SLUGS } from "@/lib/product-images";
import {
  TRANSFORMATION_ACCENTS,
  getSectionStyle,
  type HomeSectionStyle,
} from "@/lib/home-builder/section-style";
import type { HomeSection } from "@/lib/home-builder/types";
import type { FeaturedProductCard } from "@/lib/storefront";
import { HOMEPAGE_FEATURED_DISPLAY_PRICE } from "@/lib/storefront/homepage-featured-products";
import {
  Field,
  ImageUploadField,
  SectionStylePanel,
  SelectField,
  SortableListEditor,
  ToggleField,
} from "./HomeBuilderFields";

type Props = {
  section: HomeSection;
  onChange: (section: HomeSection) => void;
  catalogProducts?: FeaturedProductCard[];
};

type TransformationItem = {
  id: string;
  productName?: string;
  title?: string;
  emotionalLine?: string;
  description?: string;
  image?: string;
  stat?: string;
  statLabel?: string;
  href?: string;
  accent?: string;
};

type StringRecordItem = Record<string, string> & { id: string };

function updateStyle(
  section: HomeSection,
  onChange: (section: HomeSection) => void,
  style: HomeSectionStyle,
) {
  onChange({
    ...section,
    content: { ...section.content, style },
  });
}

function blankProductCard(catalog?: FeaturedProductCard[]): FeaturedProductCard {
  const template = catalog?.[0];
  return {
    id: `card-${Date.now()}`,
    slug: template?.slug ?? OFFICIAL_PRODUCT_SLUGS[0],
    name: template?.name ?? "منتج LIMORA",
    nameEn: template?.nameEn ?? "LIMORA Product",
    benefit: template?.benefit ?? "",
    description: template?.description ?? "",
    price: HOMEPAGE_FEATURED_DISPLAY_PRICE,
    originalPrice: "",
    badge: template?.badge ?? null,
    image: template?.image ?? "",
    cta: template?.cta ?? "اطلبي الآن",
  };
}

export default function HomeSectionEditor({
  section,
  onChange,
  catalogProducts = [],
}: Props) {
  const content = section.content as Record<string, unknown>;
  const style = getSectionStyle(content);

  const updateContent = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...content, [key]: value } });
  };

  const headerFields = section.type !== "announcement_bar" &&
    section.type !== "footer" &&
    section.type !== "countdown_banner" && (
      <>
        <Field
          label="Label (EN)"
          value={String(content.label ?? "")}
          onChange={(v) => updateContent("label", v)}
        />
        <Field
          label="العنوان"
          value={String(content.title ?? content.headline ?? "")}
          onChange={(v) =>
            updateContent(section.type === "hero" ? "headline" : "title", v)
          }
        />
        <Field
          label="الوصف / Subtitle"
          value={String(content.subtitle ?? content.subheadline ?? "")}
          onChange={(v) =>
            updateContent(section.type === "hero" ? "subheadline" : "subtitle", v)
          }
          multiline
        />
      </>
    );

  return (
    <div className="space-y-5">
      {headerFields}

      {section.type === "announcement_bar" && (
        <Field
          label="رسائل الشريط (سطر لكل رسالة)"
          value={((content.messages as string[]) ?? []).join("\n")}
          onChange={(v) => updateContent("messages", v.split("\n").filter(Boolean))}
          multiline
        />
      )}

      {section.type === "hero" && (
        <>
          <Field
            label="Headline accent"
            value={String(content.headlineAccent ?? "")}
            onChange={(v) => updateContent("headlineAccent", v)}
          />
          <Field
            label="Trust line"
            value={String(content.trustLine ?? "")}
            onChange={(v) => updateContent("trustLine", v)}
          />
          <Field
            label="CTA Primary"
            value={String(content.ctaPrimary ?? "")}
            onChange={(v) => updateContent("ctaPrimary", v)}
          />
          <Field
            label="رابط CTA Primary"
            value={String(content.ctaPrimaryHref ?? "/product/collagen-glow")}
            onChange={(v) => updateContent("ctaPrimaryHref", v)}
          />
          <Field
            label="CTA Secondary"
            value={String(content.ctaSecondary ?? "")}
            onChange={(v) => updateContent("ctaSecondary", v)}
          />
          <Field
            label="رابط CTA Secondary"
            value={String(content.ctaSecondaryHref ?? "#results")}
            onChange={(v) => updateContent("ctaSecondaryHref", v)}
          />
          <ImageUploadField
            label="صورة Hero (Desktop)"
            value={String(content.image ?? "")}
            onChange={(v) => updateContent("image", v)}
          />
          <ImageUploadField
            label="صورة Hero (Mobile — اختياري)"
            value={String(content.imageMobile ?? "")}
            onChange={(v) => updateContent("imageMobile", v)}
            folder="builder/home/mobile"
          />
          <p className="text-xs font-semibold text-foreground">إحصائيات Hero</p>
          <SortableListEditor
            items={
              ((content.stats as { value: string; label: string }[]) ?? []).map(
                (item, index) => ({ ...item, id: `stat-${index}` }),
              )
            }
            onChange={(items) =>
              updateContent(
                "stats",
                items.map(({ value, label }) => ({ value, label })),
              )
            }
            onAdd={() => ({ id: `stat-${Date.now()}`, value: "99%", label: "تسمية" })}
            addLabel="إضافة إحصائية"
            renderItem={(item, _index, update) => (
              <>
                <Field label="القيمة" value={item.value} onChange={(v) => update({ value: v })} />
                <Field label="التسمية" value={item.label} onChange={(v) => update({ label: v })} />
              </>
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Float card 1 — عنوان"
              value={String((content.floatCard1 as { title?: string })?.title ?? "")}
              onChange={(v) =>
                updateContent("floatCard1", {
                  ...(content.floatCard1 as object),
                  title: v,
                  subtitle: String(
                    (content.floatCard1 as { subtitle?: string })?.subtitle ?? "",
                  ),
                })
              }
            />
            <Field
              label="Float card 1 — وصف"
              value={String((content.floatCard1 as { subtitle?: string })?.subtitle ?? "")}
              onChange={(v) =>
                updateContent("floatCard1", {
                  ...(content.floatCard1 as object),
                  title: String((content.floatCard1 as { title?: string })?.title ?? ""),
                  subtitle: v,
                })
              }
            />
            <Field
              label="Float card 2 — Label"
              value={String((content.floatCard2 as { label?: string })?.label ?? "")}
              onChange={(v) =>
                updateContent("floatCard2", {
                  ...(content.floatCard2 as object),
                  label: v,
                  title: String((content.floatCard2 as { title?: string })?.title ?? ""),
                })
              }
            />
            <Field
              label="Float card 2 — عنوان"
              value={String((content.floatCard2 as { title?: string })?.title ?? "")}
              onChange={(v) =>
                updateContent("floatCard2", {
                  ...(content.floatCard2 as object),
                  label: String((content.floatCard2 as { label?: string })?.label ?? ""),
                  title: v,
                })
              }
            />
          </div>
        </>
      )}

      {section.type === "products" && (
        <>
          <ToggleField
            label="استخدام منتجات المتجر تلقائياً"
            checked={content.useDynamicProducts !== false}
            onChange={(v) => updateContent("useDynamicProducts", v)}
            hint="عند التفعيل: تظهر المنتجات الرسمية مع سعر العرض 199 ر.س"
          />
          {content.useDynamicProducts === false ? (
            <>
              <p className="text-xs text-muted">
                اختاري المنتجات يدوياً — الترتيب والصور والأسعار للعرض فقط.
              </p>
              <SortableListEditor<FeaturedProductCard & { id: string }>
                items={((content.productCards as FeaturedProductCard[]) ?? []).map(
                  (item, index) => ({ ...item, id: item.id || `product-${index}` }),
                )}
                onChange={(items) => updateContent("productCards", items)}
                onAdd={() => blankProductCard(catalogProducts)}
                addLabel="إضافة بطاقة منتج"
                getItemId={(item) => item.id}
                renderItem={(item, _index, update) => (
                  <>
                    <SelectField
                      label="Slug"
                      value={item.slug}
                      onChange={(v) => {
                        const match = catalogProducts.find((p) => p.slug === v);
                        update({
                          slug: v,
                          ...(match
                            ? {
                                name: match.name,
                                nameEn: match.nameEn,
                                benefit: match.benefit,
                                image: match.image,
                              }
                            : {}),
                        });
                      }}
                      options={OFFICIAL_PRODUCT_SLUGS.map((slug) => ({
                        value: slug,
                        label: slug,
                      }))}
                    />
                    <Field label="الاسم" value={item.name} onChange={(v) => update({ name: v })} />
                    <Field
                      label="الفائدة"
                      value={item.benefit}
                      onChange={(v) => update({ benefit: v })}
                    />
                    <Field
                      label="سعر العرض (عرض فقط)"
                      value={item.price}
                      onChange={(v) => update({ price: v })}
                    />
                    <Field
                      label="Badge"
                      value={item.badge ?? ""}
                      onChange={(v) => update({ badge: v || null })}
                    />
                    <Field label="CTA" value={item.cta} onChange={(v) => update({ cta: v })} />
                    <ImageUploadField
                      label="صورة المنتج"
                      value={item.image}
                      onChange={(v) => update({ image: v })}
                      folder="builder/home/products"
                    />
                  </>
                )}
              />
            </>
          ) : (
            <Field
              label="سعر العرض على الرئيسية (عرض فقط)"
              value={String(content.homepageDisplayPrice ?? HOMEPAGE_FEATURED_DISPLAY_PRICE)}
              onChange={(v) => updateContent("homepageDisplayPrice", v)}
            />
          )}
        </>
      )}

      {section.type === "before_after" && (
        <SortableListEditor<TransformationItem>
          items={
            ((content.transformations as Omit<TransformationItem, "id">[]) ?? []).map(
              (item, index) => ({ ...item, id: `tx-${index}` }),
            )
          }
          onChange={(items) =>
            updateContent(
              "transformations",
              items.map(({ id: _id, ...rest }) => rest),
            )
          }
          onAdd={() => ({
            id: `tx-${Date.now()}`,
            productName: "LIMORA",
            title: "عنوان التحول",
            emotionalLine: "",
            description: "",
            image: "",
            stat: "90%",
            statLabel: "نتيجة",
            href: "/product/collagen-glow",
            accent: "gold",
          })}
          addLabel="إضافة تحول"
          renderItem={(item, _index, update) => (
            <>
              <Field
                label="اسم المنتج"
                value={String(item.productName ?? "")}
                onChange={(v) => update({ productName: v })}
              />
              <Field label="العنوان" value={String(item.title ?? "")} onChange={(v) => update({ title: v })} />
              <Field
                label="سطر عاطفي"
                value={String(item.emotionalLine ?? "")}
                onChange={(v) => update({ emotionalLine: v })}
              />
              <Field
                label="الوصف"
                value={String(item.description ?? "")}
                onChange={(v) => update({ description: v })}
                multiline
              />
              <Field label="Stat" value={String(item.stat ?? "")} onChange={(v) => update({ stat: v })} />
              <Field
                label="Stat label"
                value={String(item.statLabel ?? "")}
                onChange={(v) => update({ statLabel: v })}
              />
              <Field label="رابط" value={String(item.href ?? "")} onChange={(v) => update({ href: v })} />
              <SelectField
                label="Accent"
                value={String(item.accent ?? "gold")}
                onChange={(v) => update({ accent: v })}
                options={TRANSFORMATION_ACCENTS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
              <ImageUploadField
                label="صورة التحول"
                value={String(item.image ?? "")}
                onChange={(v) => update({ image: v })}
                folder="builder/home/transformations"
              />
            </>
          )}
        />
      )}

      {section.type === "benefits" && (
        <SortableListEditor<StringRecordItem>
          items={((content.pillars as Record<string, string>[]) ?? []).map((item, index) => ({
            ...item,
            id: `pillar-${index}`,
          }))}
          onChange={(items) =>
            updateContent(
              "pillars",
              items.map(({ id: _id, ...rest }) => rest),
            )
          }
          onAdd={() => ({
            id: `pillar-${Date.now()}`,
            icon: "✦",
            title: "عنوان",
            description: "",
          })}
          addLabel="إضافة عنصر"
          renderItem={(item, _index, update) => (
            <>
              <Field label="Icon" value={String(item.icon ?? "")} onChange={(v) => update({ icon: v })} />
              <Field label="العنوان" value={String(item.title ?? "")} onChange={(v) => update({ title: v })} />
              <Field
                label="الوصف"
                value={String(item.description ?? "")}
                onChange={(v) => update({ description: v })}
                multiline
              />
            </>
          )}
        />
      )}

      {section.type === "faq" && (
        <SortableListEditor<StringRecordItem>
          items={((content.items as Record<string, string>[]) ?? []).map((item, index) => ({
            ...item,
            id: `faq-${index}`,
          }))}
          onChange={(items) =>
            updateContent(
              "items",
              items.map(({ id: _id, ...rest }) => rest),
            )
          }
          onAdd={() => ({ id: `faq-${Date.now()}`, question: "", answer: "" })}
          addLabel="إضافة سؤال"
          renderItem={(item, _index, update) => (
            <>
              <Field
                label="السؤال"
                value={String(item.question ?? "")}
                onChange={(v) => update({ question: v })}
              />
              <Field
                label="الجواب"
                value={String(item.answer ?? "")}
                onChange={(v) => update({ answer: v })}
                multiline
              />
            </>
          )}
        />
      )}

      {section.type === "reviews" && (
        <>
          <ToggleField
            label="استخدام آراء المتجر تلقائياً"
            checked={content.useDynamicReviews !== false}
            onChange={(v) => updateContent("useDynamicReviews", v)}
          />
          {content.useDynamicReviews === false ? (
            <SortableListEditor<StringRecordItem>
              items={((content.items as Record<string, string>[]) ?? []).map((item, index) => ({
                ...item,
                id: `review-${index}`,
              }))}
              onChange={(items) =>
                updateContent(
                  "items",
                  items.map(({ id: _id, rating, ...rest }) => ({
                    ...rest,
                    rating: Number(rating ?? 5),
                  })),
                )
              }
              onAdd={() => ({
                id: `review-${Date.now()}`,
                name: "",
                location: "",
                product: "",
                rating: "5",
                text: "",
                image: "",
              })}
              addLabel="إضافة رأي"
              renderItem={(item, _index, update) => (
                <>
                  <Field label="الاسم" value={String(item.name ?? "")} onChange={(v) => update({ name: v })} />
                  <Field
                    label="المدينة"
                    value={String(item.location ?? "")}
                    onChange={(v) => update({ location: v })}
                  />
                  <Field
                    label="المنتج"
                    value={String(item.product ?? "")}
                    onChange={(v) => update({ product: v })}
                  />
                  <Field
                    label="التقييم"
                    value={String(item.rating ?? "5")}
                    onChange={(v) => update({ rating: v })}
                    type="number"
                  />
                  <Field label="النص" value={String(item.text ?? "")} onChange={(v) => update({ text: v })} multiline />
                  <ImageUploadField
                    label="صورة العميلة"
                    value={String(item.image ?? "")}
                    onChange={(v) => update({ image: v })}
                    folder="builder/home/reviews"
                  />
                </>
              )}
            />
          ) : null}
        </>
      )}

      {section.type === "brand_story" && (
        <>
          <ImageUploadField
            label="صورة القسم"
            value={String(content.image ?? "")}
            onChange={(v) => updateContent("image", v)}
            folder="builder/home/brand"
          />
          <Field
            label="فقرات (سطر لكل فقرة)"
            value={((content.paragraphs as string[]) ?? []).join("\n")}
            onChange={(v) => updateContent("paragraphs", v.split("\n").filter(Boolean))}
            multiline
          />
          <SortableListEditor<StringRecordItem>
            items={((content.values as Record<string, string>[]) ?? []).map((item, index) => ({
              ...item,
              id: `value-${index}`,
            }))}
            onChange={(items) =>
              updateContent(
                "values",
                items.map(({ id: _id, ...rest }) => rest),
              )
            }
            onAdd={() => ({ id: `value-${Date.now()}`, icon: "✦", label: "" })}
            addLabel="إضافة قيمة"
            renderItem={(item, _index, update) => (
              <>
                <Field label="Icon" value={String(item.icon ?? "")} onChange={(v) => update({ icon: v })} />
                <Field label="Label" value={String(item.label ?? "")} onChange={(v) => update({ label: v })} />
              </>
            )}
          />
        </>
      )}

      {section.type === "promo_banner" && (
        <>
          <Field
            label="ملاحظة السعر"
            value={String(content.priceNote ?? "")}
            onChange={(v) => updateContent("priceNote", v)}
            multiline
          />
          <Field label="CTA Label" value={String(content.ctaLabel ?? "")} onChange={(v) => updateContent("ctaLabel", v)} />
          <Field label="CTA Link" value={String(content.ctaHref ?? "")} onChange={(v) => updateContent("ctaHref", v)} />
          <Field
            label="Background (CSS gradient/color)"
            value={String(content.backgroundColor ?? "")}
            onChange={(v) => updateContent("backgroundColor", v)}
          />
          <p className="text-xs font-semibold text-foreground">منتجات البانر</p>
          <SortableListEditor<StringRecordItem>
            items={((content.products as Record<string, string>[]) ?? []).map((item, index) => ({
              ...item,
              id: `promo-${index}`,
            }))}
            onChange={(items) =>
              updateContent(
                "products",
                items.map(({ id: _id, ...rest }) => rest),
              )
            }
            onAdd={() => ({
              id: `promo-${Date.now()}`,
              name: "",
              image: "",
              href: "#products",
            })}
            addLabel="إضافة منتج"
            renderItem={(item, _index, update) => (
              <>
                <Field label="الاسم" value={String(item.name ?? "")} onChange={(v) => update({ name: v })} />
                <Field label="رابط" value={String(item.href ?? "")} onChange={(v) => update({ href: v })} />
                <ImageUploadField
                  label="صورة"
                  value={String(item.image ?? "")}
                  onChange={(v) => update({ image: v })}
                  folder="builder/home/promo"
                />
              </>
            )}
          />
        </>
      )}

      {section.type === "countdown_banner" && (
        <>
          <Field label="Message" value={String(content.message ?? "")} onChange={(v) => updateContent("message", v)} />
          <Field label="Title" value={String(content.title ?? "")} onChange={(v) => updateContent("title", v)} />
          <Field label="End date text" value={String(content.endDate ?? "")} onChange={(v) => updateContent("endDate", v)} />
        </>
      )}

      {section.type === "footer" && (
        <>
          <Field label="Brand name" value={String(content.brandName ?? "")} onChange={(v) => updateContent("brandName", v)} />
          <Field label="Tagline" value={String(content.tagline ?? "")} onChange={(v) => updateContent("tagline", v)} multiline />
          <Field label="Location" value={String(content.location ?? "")} onChange={(v) => updateContent("location", v)} />
          <SortableListEditor<StringRecordItem>
            items={((content.quickLinks as Record<string, string>[]) ?? []).map((item, index) => ({
              ...item,
              id: `link-${index}`,
            }))}
            onChange={(items) =>
              updateContent(
                "quickLinks",
                items.map(({ id: _id, ...rest }) => rest),
              )
            }
            onAdd={() => ({ id: `link-${Date.now()}`, label: "", href: "" })}
            addLabel="إضافة رابط"
            renderItem={(item, _index, update) => (
              <>
                <Field label="Label" value={String(item.label ?? "")} onChange={(v) => update({ label: v })} />
                <Field label="Href" value={String(item.href ?? "")} onChange={(v) => update({ href: v })} />
              </>
            )}
          />
        </>
      )}

      {section.type !== "announcement_bar" && section.type !== "footer" && (
        <SectionStylePanel
          style={style}
          onChange={(nextStyle) => updateStyle(section, onChange, nextStyle)}
        />
      )}
    </div>
  );
}
