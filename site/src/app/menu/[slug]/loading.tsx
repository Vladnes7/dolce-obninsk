import { Header } from "@/components/Header";

// loading.tsx создаёт Suspense-границу для URL-параметров при Partial Prefetching.
export default function DishLoading() {
  return (
    <>
      <Header />
      <main aria-busy="true" aria-label="Загружаем десерт" className="min-h-svh bg-white px-4 pb-16 pt-24 md:px-8">
        <div className="mx-auto grid max-w-[1256px] gap-8 lg:grid-cols-2 lg:gap-14">
          <div aria-hidden="true" className="aspect-[4/5] rounded-2xl bg-mint-light" />
          <div aria-hidden="true" className="space-y-5 pt-4">
            <div className="h-4 w-24 rounded bg-mint-light" />
            <div className="h-12 w-3/4 rounded bg-mint-light" />
            <div className="h-8 w-28 rounded bg-mint-light" />
            <div className="h-12 w-40 rounded-full bg-mint-light" />
          </div>
        </div>
      </main>
    </>
  );
}
