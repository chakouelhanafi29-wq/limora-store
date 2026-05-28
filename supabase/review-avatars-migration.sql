-- Replace legacy Unsplash review avatars with local Gulf/Saudi LIMORA portraits.
-- Safe to run multiple times.

update reviews
set image_url = '/reviews/noura-alotaibi.webp'
where customer_name = 'نورة العتيبي'
   or product_label ilike '%collagen%'
   or product_label ilike '%glow%';

update reviews
set image_url = '/reviews/fatima-aldosari.webp'
where customer_name = 'فاطمة الدوسري'
   or product_label ilike '%hair%'
   or product_label ilike '%هير%';

update reviews
set image_url = '/reviews/maryam-alqahtani.webp'
where customer_name in ('مريم القحطاني', 'دانة القحطاني')
   or product_label ilike '%feminine%'
   or product_label ilike '%detox%'
   or product_label ilike '%radiance%';

update reviews
set image_url = '/reviews/sara-alharbi.webp'
where customer_name = 'سارة الحربي';

update reviews
set image_url = '/reviews/lama-alshammari.webp'
where customer_name in ('لمى الشمري', 'ريم الشمري');

update reviews
set image_url = '/reviews/hind-alzahrani.webp'
where customer_name = 'هند الزهراني';

update reviews
set image_url = '/reviews/reem-alqahtani.webp'
where customer_name = 'ريم القحطاني';

update reviews
set image_url = '/reviews/dana-almutairi.webp'
where customer_name = 'دانة المطيري';

-- Catch any remaining legacy remote placeholders
update reviews
set image_url = '/reviews/noura-alotaibi.webp'
where image_url is null
   or image_url = ''
   or image_url ilike '%unsplash.com%';
