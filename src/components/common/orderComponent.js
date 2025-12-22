import React from "react";

const OrderSummary = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Order ID</p>
          <p className="font-medium text-teal-600">#BK1023102456145258</p>
        </div>
        <div>
          <p className="text-gray-600">Total Amount</p>
          <p className="font-medium">$1600</p>
        </div>
        <div>
          <p className="text-gray-600">Transaction ID</p>
          <p className="font-medium text-teal-600">TXN54218390</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Date</p>
          <p className="font-medium">15 Jul, 2025</p>
        </div>
        <div>
          <p className="text-gray-600">Payment Method</p>
          <p className="font-medium">Credit Card</p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="font-medium text-green-600">Delivered</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Products Ordered</h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4 font-medium text-gray-700">
          <div>Product Name</div>
          <div>Quantity</div>
          <div>Price</div>
          <div>Subtotal</div>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded mr-3"></div>
            <span>Aloe Locking Gel</span>
          </div>
          <div>2</div>
          <div>$400</div>
          <div>$800.00</div>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded mr-3"></div>
            <span>Aloe Locking Gel</span>
          </div>
          <div>2</div>
          <div>$400</div>
          <div>$800.00</div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$1600.00</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
      <p className="mb-2">
        Nia Banks 203, Lakshmi Towers, Sector 17 New Delhi – 110075, India
      </p>
      <p className="mb-6">📞 +91 9876543210</p>

      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-600">Courier Partner</p>
          <p className="font-medium">Delhivery</p>
        </div>
        <div>
          <p className="text-gray-600">Tracking ID</p>
          <p className="font-medium text-teal-600">DLVY12345678</p>
        </div>
        <div>
          <p className="text-gray-600">Shipping Method</p>
          <p className="font-medium text-teal-600">Standard</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Dispatched On</p>
          <p className="font-medium">15 Jul, 2025</p>
        </div>
        <div>
          <p className="text-gray-600">Delivered On</p>
          <p className="font-medium">20 Jul, 2025</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Invoice Details</h2>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Invoice ID</span>
          <span className="font-medium text-teal-600">#BK1023102456145258</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Item Total</span>
          <span className="font-medium">$1600.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Taxes</span>
          <span className="font-medium">$2.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total</span>
          <span className="font-medium">$1602.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Loyalty Points Discount</span>
          <span className="font-medium">- $2.00</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total Payable Amount</span>
          <span>$1600.00</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
