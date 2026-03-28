import { FC } from "react";
import Card from "./Card";
import { ProductParams } from "@/constant.types";

interface HomeProductsParams {
    products: ProductParams[]; // adjust as needed
};

const HomeProducts = ({ products }: HomeProductsParams) => {

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article aria-labelledby="latest" className="pb-12">

            <h2 className="mb-6 text-heading-3 text-dark-900">
                Fresh from the Farm
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-16">
                {products?.map((product, index: number) => (
                    <Card
                        key={product.id}
                        products={product}
                    />
                ))}
            </div>
            <div className="flex items-center">

            <button className="px-12 py-2.5 mb-4 border rounded bg-amber-200">
                View All
            </button>
            </div>
                        </article>
        </div>
    );
};

export default HomeProducts;