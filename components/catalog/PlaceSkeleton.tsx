export default function PlaceSkeleton() {
  return (
    <div aria-hidden className="animate-pulse space-y-3 rounded-2xl bg-white p-2">
      <div className="aspect-[16/9] rounded-xl bg-slate-200" />
      <div className="space-y-2 px-2">
        <div className="h-4 w-1/3 rounded-full bg-slate-200" />
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
      <div className="flex gap-2 px-2 pb-2">
        <div className="h-7 flex-1 rounded-full bg-slate-200" />
        <div className="h-7 flex-1 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}