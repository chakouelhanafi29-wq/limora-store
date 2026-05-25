export const dynamic = "force-dynamic";

import { getAllReviews } from "@/lib/supabase/queries";
import ReviewsManager from "./ReviewsManager";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">إدارة التقييمات</h1>
        <p className="mt-1 text-sm text-muted">أضيفي وعدّلي آراء العملاء</p>
      </div>
      <ReviewsManager initialReviews={reviews} />
    </div>
  );
}
