import { ProductParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductParams }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col w-full cursor-pointer group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* IMAGE WRAPPER */}
      <div className="relative w-full aspect-[1/1] bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-3xl">
        <Image
          src={product.image_url_array[0]}
          alt={product.name}
          width={500}
          height={500}
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {/* optional badge for discount */}
        {product.discount && (
          <span className="absolute top-4 left-4 bg-amber-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-col p-4 gap-1.5 bg-white rounded-b-3xl">
        <p className="text-lg font-semibold text-gray-900 truncate">
          {product.name}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

        {/* RATINGS */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-400 text-sm font-medium">★ {4.5}</span>
          <span className="text-gray-400 text-xs">({product.quantity} sold)</span>
        </div>

        {/* PRICE & BUTTON */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-gray-900">
            {process.env.currency}
            {product.price.toFixed(2)}
          </p>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 rounded-full shadow hover:bg-amber-600 transition-colors">
            Buy now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;