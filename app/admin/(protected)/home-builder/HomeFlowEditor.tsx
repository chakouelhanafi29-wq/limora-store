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
  HOME_SECTION_LABELS,
  type HomePageConfig,
  type HomeSection,
} from "@/lib/home-builder/types";

export type HomeFlowEditorTab = "hero" | "navbar" | "sections" | "theme" | "mobile";

type HomeFlowEditorProps = {
  config: HomePageConfig;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onOpenTab: (tab: HomeFlowEditorTab) => void;
  onLayoutChange: (sections: HomeSection[]) => void;
  onToggleSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
};

function SortableFlowCard({
  section,
  index,
  total,
  selectedSectionId,
  onSelectSection,
  onOpenTab,
  onMove,
  onToggleSection,
  onDuplicateSection,
  onDeleteSection,
}: {
  section: HomeSection;
  index: number;
  total: number;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
  onOpenTab: (tab: HomeFlowEditorTab) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
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
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedSectionId === section.id;

  const openEditor = () => {
    if (section.type === "hero") {
      onOpenTab("hero");
      return;
    }
    onSelectSection(section.id);
    onOpenTab("sections");
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
      } ${section.enabled ? "" : "opacity-60"}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg px-2 py-2 text-muted hover:bg-beige"
          aria-label="سحب"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>

        <button
          type="button"
          onClick={openEditor}
          className="min-w-0 flex-1 text-right"
        >
          <p className="truncate text-sm font-medium text-foreground">
            {HOME_SECTION_LABELS[section.type]}
          </p>
          <p className="truncate text-[11px] text-muted">
            {String(
              section.content.title ??
                section.content.headline ??
                section.content.message ??
                section.id,
            )}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
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
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(section.id, "up")}
            className="rounded-lg px-2 py-1 text-xs text-champagne hover:bg-beige disabled:opacity-30"
            aria-label="تحريك لأعلى"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(section.id, "down")}
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

export default function HomeFlowEditor({
  config,
  selectedSectionId,
  onSelectSection,
  onOpenTab,
  onLayoutChange,
  onToggleSection,
  onDuplicateSection,
  onDeleteSection,
}: HomeFlowEditorProps) {
  const sections = [...config.sections].sort((a, b) => a.order - b.order);
  const sectionIds = sections.map((section) => section.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionIds.indexOf(String(active.id));
    const newIndex = sectionIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sections, oldIndex, newIndex).map(
      (section, index) => ({ ...section, order: index }),
    );
    onLayoutChange(reordered);
  };

  const handleMove = (sectionId: string, direction: "up" | "down") => {
    const index = sections.findIndex((section) => section.id === sectionId);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onLayoutChange(next.map((section, orderIndex) => ({ ...section, order: orderIndex })));
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-champagne/10 bg-gradient-to-br from-beige/40 to-white p-4">
        <p className="text-sm font-medium text-foreground">ترتيب الصفحة الرئيسية</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          اسحبي أو استخدمي ↑ ↓ لإعادة ترتيب الأقسام. التغييرات تظهر فوراً في المعاينة.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <SortableFlowCard
                key={section.id}
                section={section}
                index={index}
                total={sections.length}
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
