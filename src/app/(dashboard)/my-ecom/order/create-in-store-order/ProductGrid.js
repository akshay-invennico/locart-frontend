"use client";
import React from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

const ProductGrid = ({ products, onQuantityChange, onRemove }) => {
  const total = products.reduce(
    (sum, p) => sum + p.quantity * (p.price || 0),
    0
  );

  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="grid grid-cols-5 bg-gray-100 font-semibold text-sm text-gray-700 px-4 py-2">
        <div>Product</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Price</div>
        <div className="text-center">Subtotal</div>
        <div className="text-center"></div>
      </div>

      {products.map((product) => (
        <div
          key={product.value}
          className="grid grid-cols-5 items-center border-t px-4 py-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <Image
              src={product.icon}
              alt={product.label}
              width={32}
              height={32}
              className="rounded-md border"
            />
            <span className="font-medium">
              {product.label}
            </span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <button
              className="p-1 border rounded hover:bg-gray-200"
              onClick={() =>
                onQuantityChange(
                  product.value,
                  Math.max(product.quantity - 1, 1)
                )
              }
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              value={product.quantity}
              readOnly
              className="w-10 text-center border rounded text-sm"
            />
            <button
              className="p-1 border rounded hover:bg-gray-200"
              onClick={() =>
                onQuantityChange(product.value, product.quantity + 1)
              }
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-center">${product.price}</div>

          <div className="text-center">
            ${(product.quantity * product.price).toFixed(2)}
          </div>

          <div className="flex justify-end">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onRemove(product.value)}
            >
              <Minus className="border rounded text-[var(--color-dull-text)] w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Total Row */}
      <div className="grid grid-cols-5 bg-gray-50 font-semibold border-t px-4 py-2">
        <div className="col-span-3 text-left">Total:</div>
        <div className="text-center">${total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductGrid;
