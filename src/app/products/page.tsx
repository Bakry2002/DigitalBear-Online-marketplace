import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

type Param = string | string[] | undefined;

interface ProductPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const Page = ({ searchParams }: ProductPageProps) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);
  const categoryLabel = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={categoryLabel || "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
