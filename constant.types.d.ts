import { JSX } from "react/jsx-runtime";

interface ProductParams {
    id: string;
    author_id: string;
    sizes: string[];
    colors: string[];
    styles: string[];
    brand: string;
    status: string;
    image_url_array: string[];
    video_url_array: string[];
    name: string;
    category: {
        id: string;
        name: string;
    }
    price: number;
    description: string;
    discount: number;
    quantity: number;
    product_shipping_fee: number;
    offer_price: number;
    created_at: string;
    updated_at: string;
    location: string;
    producy_commment: string;

}