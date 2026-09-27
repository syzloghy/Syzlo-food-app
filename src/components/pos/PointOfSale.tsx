import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FoodCategory,
  MenuItem,
  CartItem,
  PaymentMethod,
} from '../../types';
import { orderService } from '../../services/orderService';
import { RESTAURANT_LOCATION } from '../../data/mockData';
import {
  Monitor,
  Printer,
  Plus,
  Minus,
  Trash2,
  Search,
  QrCode,
  Banknote,
  X,
  ShoppingBag,
  Utensils,
  Receipt,
  CheckCircle2,
  User,
  Phone,
  Clock,
  ChevronDown,
  SearchX,
  CirclePlus,
} from 'lucide-react';

type PosMode = 'DINE-IN' | 'TAKEAWAY';

const categories: FoodCategory[] = [
  'ALL',
  'BAO',
  'COMBOS',
  'CHINESE',
  'STARTERS',
  'DRINKS',
];

const tables = Array.from(
  { length: 12 },
  (_, index) => `Table ${String(index + 1).padStart(2, '0')}`
);

const currency = (amount: number) =>
  `₹${Number(amount || 0).toFixed(2)}`;

export const PointOfSale: React.FC = () => {
  const { menuItems, coupons, placeCustomerOrder } = useApp();

  const [posMode, setPosMode] = useState<PosMode>('DINE-IN');
  const [selectedTable, setSelectedTable] = useState('Table 01');
  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('UPI');

  const [printedOrder, setPrintedOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredMenuItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.category === selectedCategory;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const activeCoupon =
    coupons.find((coupon) => coupon.code === appliedCouponCode) || null;

  const breakdown = useMemo(
    () =>
      orderService.calculateOrderBreakdown(
        posCart,
        posMode === 'DINE-IN' ? 'DINE-IN' : 'PICKUP',
        activeCoupon,
        0
      ),
    [posCart, posMode, activeCoupon]
  );

  const itemCount = posCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleAddItem = (item: MenuItem) => {
    setErrorMessage('');

    setPosCart((previous) => {
      const existingIndex = previous.findIndex(
        (cartItem) => cartItem.menuItem.id === item.id
      );

      if (existingIndex >= 0) {
        return previous.map((cartItem, index) => {
          if (index !== existingIndex) return cartItem;

          const quantity = cartItem.quantity + 1;

          return {
            ...cartItem,
            quantity,
            totalPrice: quantity * cartItem.unitPrice,
          };
        });
      }

      const newItem: CartItem = {
        cartItemId: `pos-${Date.now()}-${item.id}`,
        menuItem: item,
        quantity: 1,
        selectedAddOns: [],
        unitPrice: item.price,
        totalPrice: item.price,
      };

      return [...previous, newItem];
    });
  };

  const handleUpdateQty = (
    cartItemId: string,
    newQuantity: number
  ) => {
    setPosCart((previous) =>
      newQuantity <= 0
        ? previous.filter(
            (item) => item.cartItemId !== cartItemId
          )
        : previous.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: newQuantity * item.unitPrice,
                }
              : item
          )
    );
  };

  const clearPosCart = () => {
    setPosCart([]);
    setAppliedCouponCode('');
    setErrorMessage('');
  };

  const handleCompleteOrder = async () => {
    if (posCart.length === 0 || isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage('Please enter the customer phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const newOrder = await placeCustomerOrder({
        source: 'POS',
        orderType: posMode === 'DINE-IN' ? 'DINE-IN' : 'PICKUP',
        items: posCart,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        dineInTable:
          posMode === 'DINE-IN' ? selectedTable : undefined,
        paymentMethod,
        paymentStatus: 'PAID',
        couponCode: appliedCouponCode || undefined,
      });

      if (!newOrder) {
        throw new Error('The order could not be created.');
      }

      setPrintedOrder(newOrder);
      setPosCart([]);
      setAppliedCouponCode('');
    } catch (error) {
      console.error('POS order error:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to complete the order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const startNewOrder = () => {
    setPrintedOrder(null);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F6F5F0] p-3 sm:p-5 lg:p-6 text-[#292B23]">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 78mm !important;
            max-width: 78mm !important;
            padding: 4mm !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            font-size: 11px !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#E8E6DD] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#565F28] text-white">
            <Monitor size={23} strokeWidth={1.8} />
          </div>

          <div>
            <div className="text-lg font-black tracking-tight">
              SYZLO <span className="font-medium text-[#77786F]">POS</span>
            </div>
            <p className="text-xs text-[#85867D]">
              Point of Sale · Counter Terminal
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-[#E8E6DD] bg-[#F8F7F3] px-3 py-2 text-xs font-semibold text-[#55564E]">
            <Clock size={15} />
            <span>
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#EEF0E5] px-3 py-2 text-xs font-bold text-[#565F28]">
            <span className="h-2 w-2 rounded-full bg-[#565F28]" />
            POS ACTIVE
          </div>
        </div>
      </header>

      {/* ORDER TYPE */}
      <section className="mb-5 rounded-2xl border border-[#E8E6DD] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Order type</h2>
            <p className="mt-1 text-xs text-[#85867D]">
              Select how this customer is ordering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
          <button
            type="button"
            onClick={() => setPosMode('DINE-IN')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
              posMode === 'DINE-IN'
                ? 'border-[#565F28] bg-[#565F28] text-white shadow-sm'
                : 'border-[#E8E6DD] bg-white text-[#55564E] hover:bg-[#F8F7F3]'
            }`}
          >
            <Utensils size={18} />
            Dine-in
          </button>

          <button
            type="button"
            onClick={() => setPosMode('TAKEAWAY')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
              posMode === 'TAKEAWAY'
                ? 'border-[#565F28] bg-[#565F28] text-white shadow-sm'
                : 'border-[#E8E6DD] bg-white text-[#55564E] hover:bg-[#F8F7F3]'
            }`}
          >
            <ShoppingBag size={18} />
            Takeaway
          </button>
        </div>

        {posMode === 'DINE-IN' && (
          <div className="mt-4 max-w-xs">
            <label className="mb-1.5 block text-xs font-bold text-[#66675E]">
              Select table
            </label>
            <div className="relative">
              <select
                value={selectedTable}
                onChange={(event) =>
                  setSelectedTable(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-[#E8E6DD] bg-[#FAF9F6] px-3 py-3 pr-9 text-sm font-semibold outline-none focus:border-[#565F28]"
              >
                {tables.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#77786F]"
              />
            </div>
          </div>
        )}
      </section>

      {/* MAIN POS */}
      <main className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* MENU */}
        <section className="min-w-0 rounded-2xl border border-[#E8E6DD] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold">Menu</h2>
              <p className="mt-1 text-xs text-[#85867D]">
                Select items to add to the order
              </p>
            </div>
            <div className="rounded-lg bg-[#F2F1EC] px-3 py-2 text-xs font-bold text-[#565F28]">
              {filteredMenuItems.length} items
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999A91]"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search menu items..."
              className="w-full rounded-xl border border-[#E8E6DD] bg-[#FAF9F6] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#565F28] focus:bg-white"
            />
          </div>

          {/* CATEGORIES */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === category
                    ? 'bg-[#565F28] text-white'
                    : 'bg-[#F4F3EE] text-[#62635A] hover:bg-[#EAE9E2]'
                }`}
              >
                {category === 'ALL' ? 'All items' : category}
              </button>
            ))}
          </div>

          {/* MENU GRID */}
          {filteredMenuItems.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <SearchX size={35} className="mb-3 text-[#B5B5AC]" />
              <p className="font-bold text-[#55564E]">
                No menu items found
              </p>
              <p className="mt-1 text-xs text-[#999A91]">
                Try another search or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddItem(item)}
                  className="group overflow-hidden rounded-xl border border-[#EAE8E0] bg-white text-left transition hover:border-[#9DA47A] hover:shadow-md active:scale-[0.98]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F1EC]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#B5B5AC]">
                        <ShoppingBag size={30} />
                      </div>
                    )}

                    <span
                      className={`absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-sm border bg-white ${
                        item.isVeg
                          ? 'border-green-700'
                          : 'border-red-700'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.isVeg ? 'bg-green-700' : 'bg-red-700'
                        }`}
                      />
                    </span>

                    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#565F28] shadow-md transition group-hover:bg-[#565F28] group-hover:text-white">
                      <Plus size={18} />
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="line-clamp-2 min-h-9 text-xs font-bold text-[#292B23]">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-[#565F28]">
                        {currency(item.price)}
                      </span>
                      <span className="text-[10px] font-medium text-[#999A91]">
                        Add
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ORDER PANEL */}
        <aside className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8E6DD] bg-white shadow-sm xl:sticky xl:top-5">
          <div className="border-b border-[#EAE8E0] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold">
                  Current order
                </h2>
                <p className="mt-1 text-xs text-[#85867D]">
                  {posMode === 'DINE-IN'
                    ? selectedTable
                    : 'Takeaway counter'}
                </p>
              </div>

              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#EEF0E5] px-2 text-sm font-black text-[#565F28]">
                {itemCount}
              </div>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="space-y-3 border-b border-[#EAE8E0] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#77786F]">
              <User size={15} />
              Customer details
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#66675E]">
                Customer name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                placeholder="Customer name"
                className="w-full rounded-lg border border-[#E8E6DD] bg-[#FAF9F6] px-3 py-2.5 text-sm outline-none focus:border-[#565F28]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#66675E]">
                Phone number
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999A91]"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="10-digit phone number"
                  className="w-full rounded-lg border border-[#E8E6DD] bg-[#FAF9F6] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#565F28]"
                />
              </div>
            </div>
          </div>

          {/* CART */}
          <div className="border-b border-[#EAE8E0] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#77786F]">
                Order items
              </h3>

              {posCart.length > 0 && (
                <button
                  type="button"
                  onClick={clearPosCart}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {posCart.length === 0 ? (
                <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-[#DAD8CF] bg-[#FAF9F6] px-4 text-center">
                  <ShoppingBag
                    size={28}
                    className="mb-2 text-[#B5B5AC]"
                  />
                  <p className="text-sm font-semibold text-[#77786F]">
                    Your order is empty
                  </p>
                  <p className="mt-1 text-xs text-[#999A91]">
                    Select an item from the menu
                  </p>
                </div>
              ) : (
                posCart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 border-b border-[#F0EFEA] pb-3 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold text-[#292B23]">
                        {item.menuItem.name}
                      </p>
                      <p className="mt-1 text-[11px] text-[#85867D]">
                        {currency(item.unitPrice)} each
                      </p>
                    </div>

                    <div className="flex items-center rounded-lg border border-[#E8E6DD] bg-[#FAF9F6]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          handleUpdateQty(
                            item.cartItemId,
                            item.quantity - 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center text-[#565F28] hover:bg-[#EEF0E5]"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-6 text-center text-xs font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          handleUpdateQty(
                            item.cartItemId,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center text-[#565F28] hover:bg-[#EEF0E5]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="min-w-[65px] text-right">
                      <p className="text-xs font-black">
                        {currency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COUPON */}
          <div className="border-b border-[#EAE8E0] p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#77786F]">
              Coupon / discount
            </label>

            <div className="relative">
              <select
                value={appliedCouponCode}
                onChange={(event) =>
                  setAppliedCouponCode(event.target.value)
                }
                className="w-full appearance-none rounded-lg border border-[#E8E6DD] bg-[#FAF9F6] px-3 py-2.5 pr-9 text-xs font-semibold outline-none focus:border-[#565F28]"
              >
                <option value="">No coupon selected</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.code} — {coupon.description}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#77786F]"
              />
            </div>
          </div>

          {/* BILL */}
          <div className="space-y-2 bg-[#FAF9F6] p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#77786F]">
              Bill summary
            </h3>

            <div className="flex justify-between text-xs text-[#66675E]">
              <span>Item subtotal</span>
              <span className="font-semibold text-[#292B23]">
                {currency(breakdown.itemTotal)}
              </span>
            </div>

            {breakdown.discount > 0 && (
              <div className="flex justify-between text-xs text-green-700">
                <span>Discount</span>
                <span className="font-semibold">
                  -{currency(breakdown.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xs text-[#66675E]">
              <span>GST</span>
              <span className="font-semibold text-[#292B23]">
                {currency(breakdown.tax)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#DAD8CF] pt-3">
              <span className="text-sm font-extrabold">
                Grand total
              </span>
              <span className="text-xl font-black text-[#565F28]">
                {currency(breakdown.grandTotal)}
              </span>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-3 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#77786F]">
              Payment method
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                  paymentMethod === 'UPI'
                    ? 'border-[#565F28] bg-[#EEF0E5] text-[#565F28]'
                    : 'border-[#E8E6DD] bg-white text-[#66675E] hover:bg-[#FAF9F6]'
                }`}
              >
                <QrCode size={17} />
                UPI
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                  paymentMethod === 'CASH'
                    ? 'border-[#565F28] bg-[#EEF0E5] text-[#565F28]'
                    : 'border-[#E8E6DD] bg-white text-[#66675E] hover:bg-[#FAF9F6]'
                }`}
              >
                <Banknote size={17} />
                Cash
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              disabled={posCart.length === 0 || isSubmitting}
              onClick={handleCompleteOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#565F28] px-4 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#454D20] disabled:cursor-not-allowed disabled:bg-[#B7B9AA]"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Complete order
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-[#999A91]">
              Verify the order details before completing checkout.
            </p>
          </div>
        </aside>
      </main>

      {/* RECEIPT MODAL */}
      {printedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-5">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#EAE8E0] pb-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#565F28]">
                  <CheckCircle2 size={19} />
                  Order completed
                </div>
                <p className="mt-1 text-xs text-[#85867D]">
                  Your receipt is ready to print.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPrintedOrder(null)}
                aria-label="Close receipt"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F1EC] text-[#55564E] hover:bg-[#EAE9E2]"
              >
                <X size={18} />
              </button>
            </div>

            {/* PRINTABLE RECEIPT */}
            <div
              id="printable-receipt"
              className="mx-auto max-w-[320px] border border-dashed border-[#C8C8C0] bg-white p-4 font-mono text-xs text-black"
            >
              <div className="border-b border-dashed border-[#A5A59D] pb-3 text-center">
                <h2 className="text-xl font-black tracking-widest">
                  SYZLO
                </h2>
                <p className="mt-1 text-[10px]">
                  THE BAO MAKERS
                </p>
                <p className="mt-2 text-[9px]">
                  {RESTAURANT_LOCATION.address}
                </p>
              </div>

              <div className="space-y-1 border-b border-dashed border-[#A5A59D] py-3">
                <div className="flex justify-between gap-2">
                  <span>ORDER ID</span>
                  <span className="break-all text-right font-bold">
                    {printedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DATE</span>
                  <span>
                    {new Date(
                      printedOrder.createdAt
                    ).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TIME</span>
                  <span>
                    {new Date(
                      printedOrder.createdAt
                    ).toLocaleTimeString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TYPE</span>
                  <span>{printedOrder.orderType}</span>
                </div>
                {printedOrder.dineInTable && (
                  <div className="flex justify-between">
                    <span>TABLE</span>
                    <span>{printedOrder.dineInTable}</span>
                  </div>
                )}
              </div>

              <div className="border-b border-dashed border-[#A5A59D] py-3">
                <p className="mb-2 font-bold">CUSTOMER</p>
                <p>{printedOrder.customerName}</p>
                <p>{printedOrder.customerPhone}</p>
              </div>

              <div className="border-b border-dashed border-[#A5A59D] py-3">
                <div className="mb-2 flex justify-between font-bold">
                  <span>ITEM</span>
                  <span>AMOUNT</span>
                </div>

                {printedOrder.items.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="mb-2 flex justify-between gap-3"
                  >
                    <span className="flex-1">
                      {item.menuItem.name}
                      <span className="block text-[10px]">
                        {item.quantity} × {currency(item.unitPrice)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap">
                      {currency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-b border-dashed border-[#A5A59D] py-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency(printedOrder.itemTotal)}</span>
                </div>
                {printedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>
                      -{currency(printedOrder.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>{currency(printedOrder.tax)}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-black">
                  <span>TOTAL</span>
                  <span>{currency(printedOrder.grandTotal)}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-[#A5A59D] py-3">
                <div className="flex justify-between">
                  <span>PAYMENT</span>
                  <span>{printedOrder.paymentMethod}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>STATUS</span>
                  <span>{printedOrder.paymentStatus}</span>
                </div>
              </div>

              <div className="pt-3 text-center">
                <p className="font-bold">Thank you for choosing SYZLO!</p>
                <p className="mt-1 text-[10px]">
                  Please visit us again.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#565F28] px-4 py-3 text-sm font-bold text-white hover:bg-[#454D20]"
              >
                <Printer size={17} />
                Print receipt
              </button>

              <button
                type="button"
                onClick={startNewOrder}
                className="rounded-xl border border-[#E8E6DD] bg-white px-4 py-3 text-sm font-bold text-[#55564E] hover:bg-[#F8F7F3]"
              >
                New order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
