"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PAGE_BLOCK_FINAL_CTA,
  PAGE_BLOCK_HERO,
  PAGE_BLOCK_OFFERS,
  getPageBlockLabel,
  getResolvedPageLayoutOrder,
  isPageSystemBlock,
  movePageLayoutBlock,
  type PageSystemBlockId,
} from "@/lib/page-builder/page-layout";
import type { ProductPageConfig } from "@/lib/page-builder/types";
import { SECTION_LABELS } from "@/lib/page-builder/types";

type Tab = "hero" | "offers" | "sections" | "finalCta";

type PageFlowEditorProps = {
  config: ProductPageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onOpenTab: (tab: Tab) => void;
  onLayoutChange: (layoutOrder: string[]) => void;
  onToggleSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
};

function SortableFlowCard({
  blockId,
  index,
  total,
  config,
  selectedSectionId,
  onSelectSection,
  onOpenTab,
  onMove,
  onToggleSection,
  onDuplicateSection,
  onDeleteSection,
}: {
  blockId: string;
  index: number;
  total: number;
  config: ProductPageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onOpenTab: (tab: Tab) => void;
  onMove: (blockId: string, direction: "up" | "down") => void;
  onToggleSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blockId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSystem = isPageSystemBlock(blockId);
  const section = config.sections.find((item) => item.id === blockId);
  const isSelected = section ? selectedSectionId === section.id : false;
  const label = getPageBlockLabel(blockId, config);

  const openEditor = () => {
    if (blockId === PAGE_BLOCK_HERO) {
      onOpenTab("hero");
      return;
    }
    if (blockId === PAGE_BLOCK_OFFERS) {
      onOpenTab("offers");
      return;
    }
    if (blockId === PAGE_BLOCK_FINAL_CTA) {
      onOpenTab("finalCta");
      return;
    }
    onSelectSection(blockId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl border bg-white p-3 shadow-sm transition-all ${
        isDragging
          ? "z-20 scale-[1.02] border-champagne shadow-lg ring-2 ring-champagne/20"
          : isSelected
            ? "border-champagne bg-champagne/10"
            : "border-champagne/10 hover:border-champagne/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-xl border border-champagne/15 bg-beige/40 text-muted transition hover:border-champagne/40 hover:bg-beige hover:text-foreground active:cursor-grabbing"
          aria-label="سحب لإعادة الترتيب"
          {...attributes}
          {...listeners}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <circle cx="7" cy="5" r="1.2" />
            <circle cx="13" cy="5" r="1.2" />
            <circle cx="7" cy="10" r="1.2" />
            <circle cx="13" cy="10" r="1.2" />
            <circle cx="7" cy="15" r="1.2" />
            <circle cx="13" cy="15" r="1.2" />
          </svg>
        </button>

        <button
          type="button"
          onClick={openEditor}
          className="min-w-0 flex-1 text-right"
        >
          <div className="flex items-center justify-end gap-2">
            <span className="rounded-full bg-beige px-2 py-0.5 text-[10px] text-muted">
              {index + 1}
            </span>
            <span className="truncate text-sm font-medium">{label}</span>
          </div>
          {section && (
            <p className="mt-0.5 truncate text-[11px] text-muted">
              {SECTION_LABELS[section.type]}
            </p>
          )}
          {isSystem && (
            <p className="mt-0.5 text-[11px] text-muted">قسم ثابت · قابل للتحريك</p>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1">
          {section && (
            <>
              <button
                type="button"
                onClick={() => onToggleSection(section.id)}
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  section.enabled
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-beige text-muted"
                }`}
              >
                {section.enabled ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => onDuplicateSection(section.id)}
                className="rounded-full px-2 py-1 text-[10px] text-champagne hover:bg-beige"
              >
                نسخ
              </button>
              <button
                type="button"
                onClick={() => onDeleteSection(section.id)}
                className="rounded-full px-2 py-1 text-[10px] text-red-500 hover:bg-red-50"
              >
                ×
              </button>
            </>
          )}
          {blockId === PAGE_BLOCK_FINAL_CTA && (
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                config.finalCta.enabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-beige text-muted"
              }`}
            >
              {config.finalCta.enabled ? "ON" : "OFF"}
            </span>
          )}
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(blockId, "up")}
            className="rounded-lg px-2 py-1 text-xs text-champagne hover:bg-beige disabled:opacity-30"
            aria-label="تحريك لأعلى"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(blockId, "down")}
            className="rounded-lg px-2 py-1 text-xs text-champagne hover:bg-beige disabled:opacity-30"
            aria-label="تحريك لأسفل"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PageFlowEditor({
  config,
  selectedSectionId,
  onSelectSection,
  onOpenTab,
  onLayoutChange,
  onToggleSection,
  onDuplicateSection,
  onDeleteSection,
}: PageFlowEditorProps) {
  const layoutOrder = getResolvedPageLayoutOrder(config);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = layoutOrder.indexOf(String(active.id));
    const newIndex = layoutOrder.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onLayoutChange(arrayMove(layoutOrder, oldIndex, newIndex));
  };

  const handleMove = (blockId: string, direction: "up" | "down") => {
    const next = movePageLayoutBlock(layoutOrder, blockId, direction);
    if (next) onLayoutChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-champagne/10 bg-gradient-to-br from-beige/40 to-white p-4">
        <p className="text-sm font-medium text-foreground">ترتيب الصفحة</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          اسحبي أو استخدمي ↑ ↓ لترتيب Hero، العروض، وجميع الأقسام. الترتيب يظهر
          فوراً في المعاينة ويُحفظ مع الصفحة.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layoutOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {layoutOrder.map((blockId, index) => (
              <SortableFlowCard
                key={blockId}
                blockId={blockId}
                index={index}
                total={layoutOrder.length}
                config={config}
                selectedSectionId={selectedSectionId}
                onSelectSection={onSelectSection}
                onOpenTab={onOpenTab}
                onMove={handleMove}
                onToggleSection={onToggleSection}
                onDuplicateSection={onDuplicateSection}
                onDeleteSection={onDeleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export type { Tab as PageFlowEditorTab, PageSystemBlockId };
