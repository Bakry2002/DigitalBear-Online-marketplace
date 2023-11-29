"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subTitle?: string;
  href?: string;
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
  const { title, subTitle, href, query } = props;

  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage, // fetch next page of products
      }
    );

  const products = queryResults?.pages.flatMap((page) => page.products);
  // flatMap is used to flatten the array of arrays into a single array

  let map: (Product | null)[] = [];

  if (products && products.length) {
    map = products; // if products is not null, map is equal to products
  } else if (isLoading) {
    //  if it still loading, map over a skeleton array
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }
  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          )}
          {subTitle && (
            <p className="mt-2 text-muted-foreground text-sm">{subTitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            See the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {/* List all product */}
            {map.map((product, index) => (
              <ProductListing key={index} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
