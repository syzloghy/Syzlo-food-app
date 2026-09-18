import React from 'react';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { Clock, ArrowRight, RotateCcw, MapPin, Receipt } from 'lucide-react';

export const CustomerOrdersList: React.FC = () => {
  const { orders, setActiveTrackingOrderId, setCustomerScreen, addToCart } = useApp();

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-syzlo-charcoal tracking-tight">
              Your Orders
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Live status, order history and reordering
            </p>
          </div>
          <span className="px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-xs font-bold">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 shadow-xs">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
              📦
            </div>
            <h3 className="font-bold text-base text-syzlo-charcoal">No past orders yet</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Ready to taste our freshly steamed Asian-Indian baos? Place your first order today!
            </p>
            <button
              onClick={() => setCustomerScreen('menu')}
              className="mt-4 px-5 py-2.5 bg-olive-500 text-white text-xs font-bold rounded-xl hover:bg-olive-600 transition-colors"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              const statusMeta = orderService.getStatusMeta(ord.status, ord.orderType);
              const isOngoing = ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED';

              return (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs hover:border-olive-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-olive-800 bg-olive-50 px-2.5 py-1 rounded-md border border-olive-200">
                        #{ord.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusMeta.color}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1">
                    {ord.items.map((it) => (
                      <div key={it.cartItemId} className="flex justify-between text-xs text-stone-700">
                        <span>
                          <span className="font-bold">{it.quantity}×</span> {it.menuItem.name}
                        </span>
                        <span className="font-semibold text-syzlo-charcoal">₹{it.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details & action buttons */}
                  <div className="pt-3 border-t border-cream-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-stone-400 font-medium block">
                        {ord.orderType} • {ord.paymentMethod}
                      </span>
                      <span className="font-black text-sm text-syzlo-charcoal">
                        Grand Total: ₹{ord.grandTotal}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOngoing && (
                        <button
                          onClick={() => {
                            setActiveTrackingOrderId(ord.id);
                            setCustomerScreen('tracking');
                          }}
                          className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Track Live Order</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          // Quick re-order: add items to cart
                          ord.items.forEach((it) => {
                            addToCart(it.menuItem, it.quantity, it.selectedAddOns, it.specialInstructions);
                          });
                          setCustomerScreen('cart');
                        }}
                        className="px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
