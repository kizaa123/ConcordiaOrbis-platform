"use client";

import { useState } from "react";
import { ResearchPublication } from "@/lib/types";
import { Icon } from "@/components/icons";
import { PublicationCoverImage } from "@/components/PublicationCoverImage";
import { api } from "@/lib/api";
import { useMoneyFormat } from "@/hooks/useMoneyFormat";

interface LibraryPublicationCardProps {
  pub: ResearchPublication;
  viewCount: number;
  onPayToAccess: (pub: ResearchPublication) => void;
  onReadNow: (pub: ResearchPublication) => void;
  onComment: (pub: ResearchPublication) => void;
  onLike: (pubId: string, result: { liked: boolean; likesCount: number }) => void;
  onShare: (pubId: string, sharesCount: number) => void;
  sharePath?: string;
}

function PublicationActionButton({
  pub,
  onPayToAccess,
  onReadNow,
}: Pick<LibraryPublicationCardProps, "pub" | "onPayToAccess" | "onReadNow">) {
  const { format } = useMoneyFormat();
  const hasAccess = pub.hasAccess || !pub.isLocked;

  if (hasAccess) {
    return (
      <button
        type="button"
        onClick={() => onReadNow(pub)}
        className="btn-primary w-full py-2 text-sm"
      >
        Read now
      </button>
    );
  }

  const priceLabel = pub.isFree ? null : format(pub.price ?? 0);

  return (
    <button
      type="button"
      onClick={() => onPayToAccess(pub)}
      className="btn-gold inline-flex w-full items-center justify-center gap-2 py-2 text-sm"
    >
      <Icon name="lock" className="h-4 w-4 shrink-0" />
      Pay to access{priceLabel ? ` (${priceLabel})` : ""}
    </button>
  );
}

export function LibraryPublicationCard({
  pub,
  viewCount,
  onPayToAccess,
  onReadNow,
  onComment,
  onLike,
  onShare,
  sharePath,
}: LibraryPublicationCardProps) {
  const { format } = useMoneyFormat();
  const [liking, setLiking] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const result = await api.research.like(pub.id);
      onLike(pub.id, result);
    } catch {
      /* non-blocking */
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${sharePath ?? `/library/publisher/${pub.researcher.id}?pub=${pub.id}`}`
          : "";
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: pub.title, url: shareUrl });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Publication link copied to clipboard!");
      }
      const result = await api.research.share(pub.id);
      onShare(pub.id, result.sharesCount);
    } catch {
      /* user cancelled or failed */
    } finally {
      setSharing(false);
    }
  };

  const hasAccess = pub.hasAccess || !pub.isLocked;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <PublicationCoverImage coverImage={pub.coverImage} title={pub.title} />

      <div className="flex flex-1 flex-col gap-2 p-3">
        {!hasAccess && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
            <Icon name="lock" className="h-3 w-3 shrink-0" />
            Locked
          </span>
        )}

        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-brand-900">{pub.title}</h3>
          {pub.description ? (
            <p className="line-clamp-1 text-xs leading-snug text-gray-500">{pub.description}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-gray-500">
            <Icon name="eye" className="h-3.5 w-3.5" />
            {viewCount}
          </span>
          <span className="font-semibold text-brand-700">{pub.isFree ? "Free" : format(pub.price ?? 0)}</span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className="flex items-center justify-center gap-1 rounded-lg bg-brand-50 py-1.5 text-[11px] font-semibold text-brand-800 transition hover:bg-brand-100"
            aria-label="Like"
          >
            <Icon
              name="thumbs-up"
              className={`h-3.5 w-3.5 ${pub.likedByMe ? "text-brand-700" : "text-brand-500"}`}
            />
            {pub.likesCount > 0 ? pub.likesCount : null}
          </button>

          <button
            type="button"
            onClick={() => onComment(pub)}
            className="flex items-center justify-center gap-1 rounded-lg bg-brand-50 py-1.5 text-[11px] font-semibold text-brand-800 transition hover:bg-brand-100"
            aria-label="Comment"
          >
            <Icon name="comment" className="h-3.5 w-3.5" />
            {(pub.commentsCount ?? 0) > 0 ? pub.commentsCount : null}
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center justify-center gap-1 rounded-lg bg-brand-50 py-1.5 text-[11px] font-semibold text-brand-800 transition hover:bg-brand-100"
            aria-label="Share"
          >
            <Icon name="share" className="h-3.5 w-3.5" />
            {pub.sharesCount > 0 ? pub.sharesCount : null}
          </button>
        </div>

        <div className="mt-auto pt-1">
          <PublicationActionButton pub={pub} onPayToAccess={onPayToAccess} onReadNow={onReadNow} />
        </div>
      </div>
    </article>
  );
}
