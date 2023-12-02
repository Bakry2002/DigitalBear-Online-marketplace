"use client";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const { items, removeItem } = useCart();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className=" bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight  text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative w-60 h-30 text-muted-foreground"
                >
                  <Image
                    priority={true}
                    src="/cart/beer_and_empty_cart.png"
                    alt="empty shopping cart beer"
                    loading="eager"
                    width={1024}
                    height={768}
                  />
                </div>

                <h3 className="font-semibold text-2xl m-0">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground text-center">
                  Whoops! You haven&apos;t added anything to your cart yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {items.map(({ product }) => {
                // human readable category
                const categoryLabel = PRODUCT_CATEGORIES.find(
                  (c) => c.value === product.category
                )?.label;

                const { image } = product.images[0];
                return (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            fill
                            src={image.url}
                            alt="Product image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>

                          <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                              category: {categoryLabel}
                            </p>
                          </div>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="remove product"
                              onClick={() => removeItem(product.id)}
                              variant="ghost"
                            >
                              <X className="w-5 h-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex  items-center space-x-2 text-sm text-gray-700">
                        <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Checkout section */}
          <section className="mt-16 rounded-lg bg-gray-50 px-4  py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
