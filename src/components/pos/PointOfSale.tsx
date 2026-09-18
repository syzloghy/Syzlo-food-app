import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, MenuItem, CartItem, PaymentMethod } from '../../types';
import { orderService } from '../../services/orderService';
import { RESTAURANT_LOCATION } from '../../data/mockData';
import {
  Monitor,
  Printer,
  Plus,
  Minus,
  Trash2,
  Check,
  Search,
  Receipt,
  QrCode,
  Banknote,
  Smartphone,
  X,
  User,
  Phone,
} from 'lucide-react';

export const PointOfSale: React.FC = () => {
  const { menuItems, coupons, placeCustomerOrder } = useApp();

  // POS State
  const [posMode, setPosMode] = useState<'DINE-IN' | 'TAKEAWAY'>('DINE-IN');
  const [selectedTable, setSelectedTable] = useState<string>('Table 01');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POS Cart
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('98000 12345');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  // Completed receipt modal
  const [printedOrder, setPrintedOrder] = useState<any | null>(null);

  const categories: FoodCategory[] = ['ALL', 'BAO', 'COMBOS', 'CHINESE', 'STARTERS', 'DRINKS'];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItem = (item: MenuItem) => {
    setPosCart((prev) => {
      const idx = prev.findIndex((ci) => ci.menuItem.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].quantity + 1;
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          totalPrice: newQty * item.price,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `pos-${Date.now()}-${item.id}`,
          menuItem: item,
          quantity: 1,
          selectedAddOns: [],
          unitPrice: item.price,
          totalPrice: item.price,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setPosCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
      return;
    }
    setPosCart((prev) =>
      prev.map((ci) =>
        ci.cartItemId === cartItemId
          ? { ...ci, quantity: newQty, totalPrice: newQty * ci.unitPrice }
          : ci
      )
    );
  };

  const clearPosCart = () => {
    setPosCart([]);
  };

  const activeCoupon = coupons.find((c) => c.code === appliedCouponCode) || null;
  const breakdown = orderService.calculateOrderBreakdown(
    posCart,
    posMode === 'DINE-IN' ? 'DINE-IN' : 'PICKUP',
    activeCoupon,
    0
  );

  const handleCompleteOrder = () => {
    if (posCart.length === 0) return;

    // Place POS order generating sequential ID (1801, 1802...)
    const newOrder = placeCustomerOrder({
      source: 'POS',
      orderType: posMode === 'DINE-IN' ? 'DINE-IN' : 'PICKUP',
      items: posCart,
      customerName,
      customerPhone,
      dineInTable: posMode === 'DINE-IN' ? selectedTable : undefined,
      paymentMethod,
      paymentStatus: 'PAID',
    });

    setPrintedOrder(newOrder);
    setPosCart([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-3 sm:p-6 pb-24">
      {/* Top POS Header */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-olive-500 text-white flex items-center justify-center font-bold">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-syzlo-charcoal">
              SYZLO Point of Sale (POS)
            </h1>
            <span className="text-xs text-stone-500">
              Terminal #01 • Cashier: Tanmay Joshi
            </span>
          </div>
        </div>

        {/* Mode Switcher: DINE-IN | TAKEAWAY */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-cream-100 p-1 rounded-xl border border-cream-300">
            <button
              id="pos-mode-dinein"
              onClick={() => setPosMode('DINE-IN')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posMode === 'DINE-IN'
                  ? 'bg-olive-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-syzlo-charcoal'
              }`}
            >
              🍽️ DINE-IN
            </button>
            <button
              id="pos-mode-takeaway"
              onClick={() => setPosMode('TAKEAWAY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                posMode === 'TAKEAWAY'
                  ? 'bg-olive-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-syzlo-charcoal'
              }`}
            >
              🛍️ TAKEAWAY
            </button>
          </div>

          {posMode === 'DINE-IN' && (
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="px-3 py-1.5 bg-white border border-cream-300 rounded-xl text-xs font-bold text-syzlo-charcoal focus:outline-hidden focus:border-olive-500"
            >
              {['Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05', 'Table 06'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* POS Layout: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Food Catalog Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search and Category Filter */}
          <div className="bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search food by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-olive-500 text-white shadow-xs'
                      : 'bg-cream-100 text-stone-600 hover:bg-cream-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="bg-white p-3 rounded-2xl border border-cream-200 hover:border-olive-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between select-none active:scale-98"
              >
                <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-2 bg-cream-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-xs border bg-white flex items-center justify-center ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-syzlo-charcoal line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-black text-xs text-syzlo-charcoal">
                      ₹{item.price}
                    </span>
                    <span className="w-5 h-5 rounded-lg bg-cream-100 text-olive-800 flex items-center justify-center font-bold text-xs">
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: POS Order Docket / Cart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-cream-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Docket Header */}
            <div className="flex items-center justify-between border-b border-cream-100 pb-3 mb-3">
              <div>
                <span className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider block">
                  Active Docket • {posMode}
                </span>
                <span className="text-xs text-stone-500">
                  {posMode === 'DINE-IN' ? selectedTable : 'Pickup Counter'}
                </span>
              </div>

              {posCart.length > 0 && (
                <button
                  onClick={clearPosCart}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-cream-300 focus:outline-hidden focus:border-olive-500 font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-cream-300 focus:outline-hidden focus:border-olive-500 font-semibold"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border-y border-cream-100 py-3">
              {posCart.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 font-medium">
                  Tap dishes on the left to add to POS order docket
                </div>
              ) : (
                posCart.map((it) => (
                  <div
                    key={it.cartItemId}
                    className="flex items-center justify-between text-xs py-1 border-b border-cream-50"
                  >
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-syzlo-charcoal block">
                        {it.menuItem.name}
                      </span>
                      <span className="text-[11px] text-stone-500">₹{it.unitPrice} each</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-cream-100 rounded-md p-0.5 border border-cream-300">
                        <button
                          onClick={() => handleUpdateQty(it.cartItemId, it.quantity - 1)}
                          className="w-5 h-5 rounded bg-white text-stone-800 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(it.cartItemId, it.quantity + 1)}
                          className="w-5 h-5 rounded bg-olive-500 text-white flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="font-black text-syzlo-charcoal min-w-[50px] text-right">
                        ₹{it.totalPrice}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount Code */}
            <div className="mt-3 flex items-center gap-2">
              <select
                value={appliedCouponCode}
                onChange={(e) => setAppliedCouponCode(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-cream-300 bg-white font-medium"
              >
                <option value="">Select Staff Coupon / Discount</option>
                {coupons.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Tender & Checkout */}
          <div className="space-y-3 pt-2">
            {/* Bill Calculation */}
            <div className="space-y-1 text-xs text-stone-600 bg-cream-50 p-3 rounded-xl border border-cream-200">
              <div className="flex justify-between">
                <span>Item Subtotal:</span>
                <span className="font-semibold text-syzlo-charcoal">₹{breakdown.itemTotal}</span>
              </div>
              {breakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{breakdown.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant GST (5%):</span>
                <span>₹{breakdown.tax}</span>
              </div>
              <div className="flex justify-between font-black text-base text-syzlo-charcoal pt-1.5 border-t border-cream-200">
                <span>Grand Total:</span>
                <span>₹{breakdown.grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="pos-pay-upi"
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  paymentMethod === 'UPI'
                    ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
                    : 'bg-cream-100 text-stone-700 border-cream-300'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI QR TENDER</span>
              </button>

              <button
                id="pos-pay-cash"
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  paymentMethod === 'CASH'
                    ? 'bg-olive-500 text-white border-olive-600 shadow-xs'
                    : 'bg-cream-100 text-stone-700 border-cream-300'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>CASH TENDER</span>
              </button>
            </div>

            {/* Complete Order Button */}
            <button
              id="pos-complete-order-btn"
              disabled={posCart.length === 0}
              onClick={handleCompleteOrder}
              className="w-full py-3.5 bg-olive-500 hover:bg-olive-600 disabled:bg-stone-300 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>COMPLETE ORDER (GENERATE RECEIPT)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Invoice / Thermal Receipt Modal */}
      {printedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <span className="font-extrabold text-xs text-olive-700 uppercase tracking-wider">
                Order Completed Successfully
              </span>
              <button
                onClick={() => setPrintedOrder(null)}
                className="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Thermal Receipt Box */}
            <div id="printable-receipt" className="border border-dashed border-stone-400 p-4 rounded-xl bg-cream-50 font-mono text-xs space-y-2 text-stone-800">
              <div className="text-center border-b border-dashed border-stone-300 pb-2">
                <h3 className="font-black text-sm tracking-wider uppercase">SYZLO</h3>
                <p className="text-[10px]">"The Bao Makers"</p>
                <p className="text-[9px] text-stone-500">{RESTAURANT_LOCATION.address}</p>
                <p className="text-[9px] font-bold mt-1">GSTIN: 27AABCS1234F1Z5</p>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>ORDER: #{printedOrder.id}</span>
                <span>{printedOrder.orderType}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Date: {new Date(printedOrder.createdAt).toLocaleTimeString()}</span>
                <span>{printedOrder.dineInTable || 'Counter'}</span>
              </div>
              <div className="text-[11px]">
                Cust: {printedOrder.customerName} ({printedOrder.customerPhone})
              </div>

              <div className="border-t border-dashed border-stone-300 pt-2 space-y-1">
                {printedOrder.items.map((it: CartItem) => (
                  <div key={it.cartItemId} className="flex justify-between text-[11px]">
                    <span>
                      {it.quantity}× {it.menuItem.name}
                    </span>
                    <span>₹{it.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-stone-300 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{printedOrder.itemTotal}</span>
                </div>
                {printedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{printedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{printedOrder.tax}</span>
                </div>
                <div className="flex justify-between font-black text-xs pt-1 border-t border-stone-400">
                  <span>TOTAL:</span>
                  <span>₹{printedOrder.grandTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>Payment: {printedOrder.paymentMethod}</span>
                  <span>Status: PAID</span>
                </div>
              </div>

              <div className="text-center text-[9px] pt-2 border-t border-dashed border-stone-300">
                Thank you for dining with SYZLO!
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-olive-500 hover:bg-olive-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT INVOICE</span>
              </button>
              <button
                onClick={() => setPrintedOrder(null)}
                className="px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
