"use client";

import { OrderParams } from "@/constant.types";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, Phone, Calendar, Eye, Star, Trash2 } from "lucide-react";

const UserOrders = ({ userOrders }: { userOrders: OrderParams[] }) => {
  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'delivered' || statusLower === 'completed') return 'bg-green-100 text-green-800';
    if (statusLower === 'processing') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'shipped') return 'bg-purple-100 text-purple-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const handleDelete = (orderId: string) => {
    // Implement delete logic here
    console.log("Delete order:", orderId);
  };

  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="px-6 md:px-16 lg:px-32 py-20 max-w-7xl mx-auto">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#043033] text-white px-6 py-3 rounded-xl hover:bg-[#021a16] transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-6 md:px-16 lg:px-32 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-500 mt-1">Manage and track your orders</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {userOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    {/* Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={order.image_url}
                            alt={order.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {order.quantity_bought}
                          </p>
                          {order.size && (
                            <p className="text-sm text-gray-500">
                              Size: {order.size}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Shipping Address */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          <p>{order.address}</p>
                          <p>{order.city}, {order.state}</p>
                          <p>{order.region}</p>
                          <p className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {order.country_code}{order.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {process.env.NEXT_PUBLIC_CURRENCY}{order.amount_paid?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.created_at)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/order/${order.id}`}
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {order.status === "completed" && (
                          <Link
                            href={`/add-review/${order.id}`}
                            className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                            title="Review Product"
                          >
                            <Star className="w-4 h-4" />
                          </Link>
                        )}
                        
                        {(order.status === "completed" || order.status === "cancelled") && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;