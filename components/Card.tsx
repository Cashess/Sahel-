import { ProductParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";

export default function Card({ products }: { products: ProductParams }) {
   return (
      <article className="group rounded-xl mt-7 bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500 p-4">

         {/* Image + Link */}
         <Link href={`/products/${products.id}`}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-light-200">
               <Image
                  src={products.image_url_array[0]}
                  alt={products.name}
                  width={600}
                  height={600}
                  className="object-cover transition-all duration-500 group-hover:scale-110 hover:shadow-xl"
               />
            </div>
         </Link>

         {/* Content */}
         <div className="mt-4 space-y-2">
            <Link href={`/products/${products.id}`}>
               <p className="text-base font-medium truncate">
                  {products.name}
               </p>
            </Link>

            <p className="text-xs text-gray-500 line-clamp-2">
               {products.description}
            </p>

            <p className="text-xs text-gray-400">(4.5)</p>

            <div className="flex items-center justify-between mt-2">
               <p className="text-lg font-bold">
                  ${products.price ? products.price.toFixed(2) : "0.00"}
               </p>

               <button className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded hover:bg-amber-700">
                  Add to Cart
               </button>
            </div>
         </div>
      </article>
   );
}