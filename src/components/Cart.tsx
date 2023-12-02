"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";

const Cart = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { items } = useCart();
  let itemCount = items.length;

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  ); // 0 is the initial value of total

  const fee = 5;
  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-gray-500"
        />

        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? (
            itemCount
          ) : (
            <Loader2 className="animate-spin text-zinc-300 w-3 h-3 overflow-hidden" />
          )}
        </span>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <Fragment>
            <div className="flex-1 pr-6 py-8 overflow-y-auto">
              <div className="flex flex-col justify-center h-auto">
                <div className="flex-1 flex flex-col px-6 py-8 bg-gray-200 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="flex w-full flex-col pr-6">
                    <ScrollArea>
                      {items.map(({ product }) => (
                        <CartItem key={product.id} product={product} />
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  {/* asChild stops the trigger as button to do our own trigger */}
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Proceed to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </Fragment>
        ) : (
          <div className="flex-1 pr-6 py-8 overflow-y-auto">
            <div className="flex flex-col justify-center h-full">
              <div className="flex-1 flex flex-col items-center justify-center px-2 py-8 bg-gray-200 border-2 border-gray-300 border-dashed rounded-md">
                <div className="flex h-full flex-col items-center justify-center space-y-1">
                  <div
                    aria-hidden="true"
                    className="relative mb-4 w-60 h-60 text-muted-foreground"
                  >
                    <Image
                      priority={true}
                      fill
                      src="/cart/beer_and_empty_cart.png"
                      alt="empty shopping cart beer"
                      objectFit="cover"
                    />
                  </div>
                  <div className="text-xl font-semibold">
                    Your cart is empty!
                  </div>
                  <SheetTrigger asChild>
                    <Link
                      href="/products"
                      className={buttonVariants({
                        variant: "link",
                        size: "sm",
                        className: "text-sm text-muted-foreground",
                      })}
                    >
                      Browse products
                    </Link>
                  </SheetTrigger>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
