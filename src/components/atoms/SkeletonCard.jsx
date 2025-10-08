import * as React from "react";

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-md bg-zinc-100/60 p-5 flex flex-col items-center">
      <div className="w-32 h-32 rounded-xl bg-zinc-200" />
      <div className="mt-4 h-3 w-24 rounded bg-zinc-200" />
      <div className="mt-2 h-3 w-16 rounded bg-zinc-200" />
    </div>
  );
});
SkeletonCard.displayName = 'SkeletonCard';

export default SkeletonCard;