"use client";

import { useEffect, useRef, useState } from "react";

export type Review = {
  name: string;
  stars: number;
  text: string;
  publishAt: string;
  reviewerPhotoUrl: string;
  reviewImageUrls: string[];
  reviewId: string;
};

function initials(name: string) {
  if (!name) return "G";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const StarIcon = ({ fillPercent = 100 }: { fillPercent?: number }) => {
  const id = `star-grad-${fillPercent}`;
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercent}%`} stopColor="#fbbc04" />
          <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
};

const VerifiedBadge = () => (
  <svg className="w-[18px] h-[18px] text-[#1a73e8]" viewBox="0 0 24 24">
    <path fill="currentColor" d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const GoogleGLogo = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

type ProcessedGroup = 
  | { id: string; type: 'single'; item: Review }
  | { id: string; type: 'stacked'; items: Review[] };

export default function Reviews() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollState, setScrollState] = useState({ isStart: true, isEnd: false });

  const [activeModal, setActiveModal] = useState<{
    review: Review;
    imageIndex: number;
  } | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/reviews.json");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setScrollState({
      isStart: scrollLeft <= 0,
      isEnd: Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2,
    });
  };

  useEffect(() => {
    if (!isLoading && reviews.length > 0) {
      handleScroll();
    }
  }, [isLoading, reviews.length]);

  const scrollByAmount = (delta: number) => {
    rowRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const openModal = (review: Review, index: number) => {
    setActiveModal({ review, imageIndex: index });
  };

  const closeModal = () => setActiveModal(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModal) return;
    const total = activeModal.review.reviewImageUrls.length;
    setActiveModal({ ...activeModal, imageIndex: (activeModal.imageIndex + 1) % total });
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModal) return;
    const total = activeModal.review.reviewImageUrls.length;
    setActiveModal({ ...activeModal, imageIndex: (activeModal.imageIndex - 1 + total) % total });
  };

  const groupedReviews: ProcessedGroup[] = [];
  let textPair: Review[] = [];

  reviews.forEach((review, i) => {
    const hasPhotos = review.reviewImageUrls && review.reviewImageUrls.length > 0;
    
    if (hasPhotos) {
      if (textPair.length > 0) {
        groupedReviews.push({ id: `stacked-${i}`, type: 'stacked', items: [...textPair] });
        textPair = [];
      }
      groupedReviews.push({ id: `single-${i}`, type: 'single', item: review });
    } else {
      textPair.push(review);
      if (textPair.length === 2) {
        groupedReviews.push({ id: `stacked-${i}`, type: 'stacked', items: [...textPair] });
        textPair = [];
      }
    }
  });
  
  if (textPair.length > 0) {
    groupedReviews.push({ id: `stacked-end`, type: 'stacked', items: [...textPair] });
  }

  const ReviewCardContent = ({ review }: { review: Review }) => {
    const displayImages = review.reviewImageUrls?.slice(0, 4) || [];
    const extraImagesCount = (review.reviewImageUrls?.length || 0) - 4;

    const formattedText = review.text ? review.text.replace(/<br\s*\/?>/gi, '\n') : "";

    return (
      <>
        <div>
          <header className="mb-4 flex items-center gap-3">
            <div className="relative inline-block">
              {review.reviewerPhotoUrl ? (
                <img
                  src={review.reviewerPhotoUrl}
                  alt={review.name}
                  className="h-[46px] w-[46px] rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                  {initials(review.name)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-[2px] border-white shadow-sm flex items-center justify-center">
                <GoogleGLogo className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-[15px] text-[#202124] line-clamp-1">
                  {review.name}
                </p>
                <VerifiedBadge />
              </div>
              <span className="text-[13px] text-gray-600 mt-0.5">{review.publishAt}</span>
            </div>
          </header>

          <div className="flex gap-[1px] mb-3">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} fillPercent={i < (review.stars || 0) ? 100 : 0} />
            ))}
          </div>

          {formattedText && (
            <p className="line-clamp-4 text-[14px] leading-relaxed text-[#4d5156] mb-5 whitespace-pre-line">
              {formattedText}
            </p>
          )}

          {displayImages.length > 0 && (
            <div className={`grid gap-1.5 rounded-xl overflow-hidden ${displayImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {displayImages.map((photoUrl, i) => (
                <div 
                  key={i} 
                  className="relative aspect-square cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => openModal(review, i)}
                >
                  <img
                    src={photoUrl}
                    alt="Review attachment"
                    className="w-full h-full object-cover"
                  />
                  {i === 3 && extraImagesCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-medium">
                      +{extraImagesCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <section className="bg-[#F8F4EC] py-20 min-h-[400px] flex items-center justify-center text-gray-500">
        Loading reviews...
      </section>
    );
  }

  if (reviews.length === 0) return null;

  const activeFormattedText = activeModal?.review?.text ? activeModal.review.text.replace(/<br\s*\/?>/gi, '\n') : "";

  return (
    <section id="reviews" className="bg-[#F8F4EC] py-16 relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        <h2 className="font-display text-4xl text-[#1C2B1E] md:text-5xl text-center mb-10">
          What Our Customers Say about us
        </h2>

        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 md:px-6 md:py-4 rounded-2xl shadow-sm border border-gray-200 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src="/images/google.svg" alt="Google" className="h-[26px] w-auto" />
              <span className="text-[24px] font-semibold text-[#202124] tracking-tight ml-1">Reviews</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#202124]">4.7</span>
              <div className="flex gap-[1px]">
                <StarIcon fillPercent={100} />
                <StarIcon fillPercent={100} />
                <StarIcon fillPercent={100} />
                <StarIcon fillPercent={100} />
                <StarIcon fillPercent={70} />
              </div>
            </div>
          </div>
          
          <a 
            href="https://www.google.com/search?hl=en-LK&gl=lk&q=Heritage+Family+Restaurant,+A7+,+Thunkinda,+Yatiyanthota+71724&ludocid=7445818215228226885&lsig=AB86z5WLFZbAcpmpeMGRD4CRYqiB#lrd=0x3ae309ddfe4f6ef9:0x6754dc3794cfbd45,3"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1a73e8] hover:bg-[#1557b0] transition-colors text-white font-bold px-6 py-2.5 rounded-full text-sm inline-block"
          >
            Review us on Google
          </a>
        </div>

        <div className="relative w-full group">
          
          {!scrollState.isStart && (
            <button
              onClick={() => scrollByAmount(-350)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-3 hover:bg-gray-50 transition-opacity opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          {!scrollState.isEnd && (
            <button
              onClick={() => scrollByAmount(350)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-3 hover:bg-gray-50 transition-opacity opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          <div
            ref={rowRef}
            onScroll={handleScroll}
            className="flex items-start snap-x snap-mandatory gap-3.5 overflow-x-auto pt-2 pb-4 scrollbar-hide w-full"
          >
            {groupedReviews.map((group) => {
              if (group.type === 'single') {
                return (
                  <article
                    key={group.id}
                    className="min-w-[320px] max-w-[320px] snap-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between flex-shrink-0 h-fit"
                  >
                    <ReviewCardContent review={group.item} />
                  </article>
                );
              } else {
                return (
                  <div key={group.id} className="min-w-[320px] max-w-[320px] snap-start flex flex-col gap-3.5 flex-shrink-0">
                    {group.items.map((review, i) => (
                      <article
                        key={`${group.id}-${i}`}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-fit"
                      >
                        <ReviewCardContent review={review} />
                      </article>
                    ))}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeModal}>
          <div className="flex flex-col md:flex-row w-full max-w-5xl h-[80vh] bg-[#222] rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="flex-grow relative flex items-center justify-center group h-1/2 md:h-full bg-black">
              <img 
                src={activeModal.review.reviewImageUrls[activeModal.imageIndex]} 
                alt="Enlarged review photo" 
                className="w-full h-full object-contain"
              />
              
              {activeModal.review.reviewImageUrls.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 p-3 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextImage} className="absolute right-4 p-3 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            <div className="w-full md:w-[380px] bg-white flex flex-col relative h-1/2 md:h-full overflow-y-auto shrink-0">
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="p-6 pt-12">
                <header className="mb-4 flex items-center gap-3">
                  <div className="relative inline-block">
                    {activeModal.review.reviewerPhotoUrl ? (
                      <img src={activeModal.review.reviewerPhotoUrl} className="h-11 w-11 rounded-full object-cover" alt={activeModal.review.name} />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                        {initials(activeModal.review.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-[2px] border-white shadow-sm flex items-center justify-center">
                      <GoogleGLogo className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-base text-[#202124]">{activeModal.review.name}</h3>
                      <VerifiedBadge />
                    </div>
                    <span className="text-[13px] text-gray-500">{activeModal.review.publishAt}</span>
                  </div>
                </header>

                <div className="flex gap-[1px] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} fillPercent={i < (activeModal.review.stars || 0) ? 100 : 0} />
                  ))}
                </div>

                <p className="text-[#4d5156] text-[14px] leading-relaxed whitespace-pre-line">
                  {activeFormattedText}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}