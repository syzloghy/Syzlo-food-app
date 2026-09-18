import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { DeliveryMap } from '../common/DeliveryMap';
import {
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Circle,
  ChefHat,
  Bike,
  Store,
  ArrowRight,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTracking: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    updateOrderStatus,
    setCustomerScreen,
    riders,
  } = useApp();

  // Find active order or fallback to first order
  const currentOrder =
    orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'rider'; text: string; time: string }[]>([
    { sender: 'rider', text: 'Hi! I have picked up your SYZLO order. It is packed in thermal insulated bag and I am on the way.', time: '12:50 PM' },
  ]);

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-2xl mb-3">
          📦
        </div>
        <h2 className="text-lg font-bold text-syzlo-charcoal">No Active Orders Found</h2>
        <button
          onClick={() => setCustomerScreen('menu')}
          className="mt-4 px-4 py-2 bg-olive-500 text-white rounded-xl text-xs font-bold"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  // Delivery status timeline progression steps
  const deliverySteps: { status: OrderStatus; label: string; desc: string }[] =
    currentOrder.orderType === 'DELIVERY'
      ? [
          { status: 'ORDER_PLACED', label: 'Order Placed', desc: 'Received by SYZLO' },
          { status: 'RESTAURANT_ACCEPTED', label: 'Restaurant Accepted', desc: 'Kitchen acknowledged order' },
          { status: 'PREPARING', label: 'Preparing Food', desc: 'Steaming fresh baos & wok fire' },
          { status: 'READY', label: 'Order Ready', desc: 'Packed in thermal bag' },
          { status: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: currentOrder.riderName ? `${currentOrder.riderName} is arriving at restaurant` : 'Locating nearest rider' },
          { status: 'PICKED_UP', label: 'Picked Up', desc: 'Rider collected package' },
          { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'On the way to your doorstep' },
          { status: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your hot meal!' },
        ]
      : currentOrder.orderType === 'PICKUP'
      ? [
          { status: 'ORDER_PLACED', label: 'Order Placed', desc: 'Received at counter' },
          { status: 'RESTAURANT_ACCEPTED', label: 'Accepted', desc: 'Order confirmed' },
          { status: 'PREPARING', label: 'Preparing', desc: 'Cooking your meal' },
          { status: 'READY', label: 'Ready for Pickup', desc: 'Ready at SYZLO pickup counter' },
          { status: 'PICKED_UP', label: 'Picked Up / Completed', desc: 'Order handed over' },
        ]
      : [
          { status: 'ORDER_PLACED', label: 'Order Placed', desc: 'Sent to kitchen' },
          { status: 'RESTAURANT_ACCEPTED', label: 'Accepted', desc: 'Confirmed by kitchen' },
          { status: 'PREPARING', label: 'Preparing', desc: 'Live cooking' },
          { status: 'READY', label: 'Ready to Serve', desc: `Heading to ${currentOrder.dineInTable || 'table'}` },
          { status: 'DELIVERED', label: 'Served & Completed', desc: 'Bon appetit!' },
        ];

  const currentStepIndex = deliverySteps.findIndex((s) => s.status === currentOrder.status);
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 0;

  // Simulate rider coordinate fallback or active coordinate
  const riderLocation = currentOrder.riderLocation || { lat: 19.0596, lng: 72.8312 };
  const customerCoords = currentOrder.deliveryAddress
    ? { lat: currentOrder.deliveryAddress.latitude || 19.0650, lng: currentOrder.deliveryAddress.longitude || 72.8270 }
    : { lat: 19.0650, lng: 72.8270 };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = { sender: 'user' as const, text: chatMessage, time: 'Just now' };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'rider',
          text: 'Got it! Following the directions.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Order Meta Card */}
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-black text-olive-800 bg-olive-100 px-2.5 py-0.5 rounded-md">
                #{currentOrder.id}
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                • {currentOrder.orderType} • {currentOrder.paymentMethod} ({currentOrder.paymentStatus})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-syzlo-charcoal tracking-tight">
              {currentOrder.status === 'DELIVERED'
                ? 'Order Delivered Successfully'
                : `Arriving in approx ${currentOrder.estimatedMinutes} mins`}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Freshly prepared by SYZLO Hill Road Kitchen Hub
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* Quick Simulation Stepper for testing demo */}
            <div className="bg-cream-100 p-1.5 rounded-xl flex items-center gap-1 text-[11px] font-bold text-stone-600">
              <span className="text-[10px] text-stone-400 uppercase px-1">Simulate:</span>
              <button
                onClick={() => {
                  const nextIdx = Math.min(deliverySteps.length - 1, activeStepIdx + 1);
                  updateOrderStatus(currentOrder.id, deliverySteps[nextIdx].status);
                }}
                className="px-2 py-1 bg-white hover:bg-olive-500 hover:text-white rounded-lg text-olive-800 transition-colors shadow-2xs"
                title="Advance order status"
              >
                Next Status →
              </button>
            </div>
          </div>
        </div>

        {/* Live Delivery Map (If Delivery Order) */}
        {currentOrder.orderType === 'DELIVERY' && (
          <div className="space-y-2">
            <DeliveryMap
              riderCoords={currentOrder.status !== 'DELIVERED' ? riderLocation : undefined}
              customerCoords={customerCoords}
              heightClass="h-72 sm:h-96"
              statusText={
                currentOrder.status === 'OUT_FOR_DELIVERY'
                  ? 'Rider en route to your address'
                  : currentOrder.status === 'DELIVERED'
                  ? 'Delivery completed'
                  : 'Order in preparation at SYZLO'
              }
            />

            {/* Rider Information Bar */}
            {currentOrder.riderName && (
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-olive-100 border border-olive-200 flex items-center justify-center text-xl shrink-0 font-bold text-olive-800">
                    🛵
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Delivery Partner
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-syzlo-charcoal">
                      {currentOrder.riderName}
                    </h3>
                    <span className="text-xs text-stone-500 block">
                      Electric EV • 4.9 ★ (400+ deliveries)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCallModalOpen(true)}
                    className="p-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-syzlo-charcoal text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-olive-700" />
                    <span className="hidden sm:inline">CALL</span>
                  </button>

                  <button
                    onClick={() => setChatModalOpen(true)}
                    className="p-2.5 rounded-xl bg-olive-500 hover:bg-olive-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">CHAT</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-6">
          <h2 className="font-black text-base text-syzlo-charcoal uppercase tracking-wider">
            Live Order Status
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-cream-200">
            {deliverySteps.map((step, idx) => {
              const isPast = idx < activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              return (
                <div key={step.status} className="relative flex items-start gap-4">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ring-4 ring-white transition-all ${
                      isPast
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-olive-500 animate-pulse ring-olive-200'
                        : 'bg-stone-300'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Step details */}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-olive-700 text-base'
                            : isPast
                            ? 'text-syzlo-charcoal'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-black uppercase">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Receipt Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-bold text-sm text-syzlo-charcoal uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-olive-600" />
              <span>Items Ordered</span>
            </h3>
            <span className="text-xs font-semibold text-stone-500">
              Placed at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-2.5">
            {currentOrder.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-syzlo-charcoal">
                    {item.menuItem.name} × {item.quantity}
                  </span>
                  {item.selectedAddOns.length > 0 && (
                    <span className="text-[11px] text-stone-500 block">
                      Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-bold text-syzlo-charcoal">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-100 pt-3 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{currentOrder.itemTotal}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({currentOrder.couponCode})</span>
                <span>-₹{currentOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{currentOrder.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span>₹{currentOrder.tax}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-syzlo-charcoal pt-2 border-t border-cream-200">
              <span>Grand Total</span>
              <span>₹{currentOrder.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call Rider Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-olive-100 text-olive-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-syzlo-charcoal">Call Delivery Partner</h3>
            <p className="text-xs text-stone-500 mt-1">{currentOrder.riderName}</p>
            <div className="my-4 p-3 bg-cream-100 rounded-xl font-mono text-sm font-bold text-syzlo-charcoal">
              {currentOrder.riderPhone || '+91 98201 45892'}
            </div>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-olive-500 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Chat with Rider Modal */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full h-[450px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-olive-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  🛵
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{currentOrder.riderName}</h4>
                  <span className="text-[10px] text-cream-200">Delivery Partner • Live Chat</span>
                </div>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#FAF6EF]">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-olive-500 text-white rounded-br-xs'
                        : 'bg-white text-syzlo-charcoal border border-cream-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-cream-200 flex gap-2">
              <input
                type="text"
                placeholder="Type a message (e.g. Please ring bell twice)..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-olive-500 text-white font-bold text-xs rounded-xl hover:bg-olive-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
