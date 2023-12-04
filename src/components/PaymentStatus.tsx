"use client";

import { trpc } from "@/trpc/client";
import { router } from "@/trpc/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  orderEmail,
  orderId,
  isPaid,
}) => {
  const router = useRouter();
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false, // only poll if not paid yet
      refetchInterval: (data) => (data?.isPaid ? false : 1000), // stop polling when paid after 1s
    }
  );

  // once it paid
  useEffect(() => {
    if (data?.isPaid) {
      router.refresh(); // refresh the page to show the download link
    }
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping To</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium to-gray-900">Order Status</p>
        <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
