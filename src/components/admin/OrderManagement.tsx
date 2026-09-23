import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerOrder, OrderStatus, CartItem, CartItemAddon, Rider } from '../../types';
import { orderService } from '../../services/orderService';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Bike,
  XCircle,
  Eye,
  Phone,
  AlertCircle,
  MessageSquare,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Send,
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, assignRiderToOrder, riders, brandConfig } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<CustomerOrder | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'NEW') return o.status === 'ORDER_PLACED' || o.status === 'RESTAURANT_ACCEPTED';
    if (statusFilter === 'PREPARING') return o.status === 'PREPARING';
    if (statusFilter === 'READY') return o.status === 'READY';
    if (statusFilter === 'DELIVERED') return o.status === 'DELIVERED';
    if (statusFilter === 'CANCELLED') return o.status === 'CANCELLED';
    return true;
  });

  const filterTabs = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'NEW', label: 'New' },
    { id: 'PREPARING', label: 'Preparing' },
    { id: 'READY', label: 'Ready' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  // Helper to generate WhatsApp dispatch text with location
  const generateRiderWhatsAppUrl = (order: CustomerOrder, rider: Rider) => {
    const cleanRiderPhone = rider.phone.replace(/\D/g, '');
    const lat = order.deliveryAddress?.location?.lat || order.riderLocation?.lat || 19.0558;
    const lng = order.deliveryAddress?.location?.lng || order.riderLocation?.lng || 72.8295;
    const osmMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    
    const itemsSummary = order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(', ');
    const addressStr = order.deliveryAddress
      ? `${order.deliveryAddress.houseNo}, ${order.deliveryAddress.street}, ${order.deliveryAddress.areaLandmark}`
      : 'Pickup / Counter';

    const message = `🛵 *SYZLO DELIVERY DISPATCH*\n` +
      `Hello ${rider.name},\n` +
      `You have been assigned to delivery Order *#${order.id}*.\n\n` +
      `👤 *Customer:* ${order.customerName} (${order.customerPhone})\n` +
      `📍 *Delivery Address:* ${addressStr}\n` +
      `🗺️ *Drop Location Map:* ${osmMapUrl}\n` +
      `🍲 *Items:* ${itemsSummary}\n` +
      `💰 *Total:* ₹${order.grandTotal} (${order.paymentStatus || 'PAID'})\n` +
      (order.packagingFee ? `📦 *Packaging:* ₹${order.packagingFee}\n` : '') +
      `\nPlease pick up from SYZLO kitchen as soon as status is READY. Drive safely!`;

    return `https://api.whatsapp.com/send?phone=${cleanRiderPhone}&text=${encodeURIComponent(message)}`;
  };

  const generateCustomerWhatsAppUrl = (order: CustomerOrder) => {
    const cleanCustomerPhone = order.customerPhone.replace(/\D/g, '');
    const message = `Hello ${order.customerName}! Your order *#${order.id}* from ${brandConfig.brandName} is currently ${order.status}.\n` +
      (order.riderName ? `🛵 Assigned Delivery Partner: ${order.riderName} (${order.riderPhone})\n` : '') +
      `Thank you for ordering comfort food from SYZLO!`;

    return `https://api.whatsapp.com/send?phone=${cleanCustomerPhone}&text=${encodeURIComponent(message)}`;
  };

  const handleCopyDispatchText = (order: CustomerOrder, rider: Rider) => {
    const lat = order.deliveryAddress?.location?.lat || 19.0558;
    const lng = order.deliveryAddress?.location?.lng || 72.8295;
    const osmMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    const text = `Order #${order.id} for ${order.customerName} (${order.customerPhone}). Address: ${order.deliveryAddress?.houseNo}, ${order.deliveryAddress?.street}. Location: ${osmMapUrl}`;
    navigator.clipboard?.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

return (
  <div className="space-y-4">

    {/* =====================================================
        ORDERS HEADER
    ====================================================== */}
    <div className="space-y-4">

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">

        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] font-black text-[#969080]">
            Operations
          </p>

          <div className="flex items-center gap-2.5 mt-1.5">
            <h1 className="text-[24px] font-black tracking-tight text-[#20221A]">
              Orders
            </h1>

            <span className="min-w-[28px] h-[22px] px-2 rounded-full bg-[#E9E8D7] text-[#565F28] text-[9px] font-black flex items-center justify-center">
              {filteredOrders.length}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#969188]">
            Manage incoming orders, preparation and delivery.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg bg-[#F3F0E8] border border-[#E5DED1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#565F28]" />

          <span className="text-[9px] font-bold text-[#66635A]">
            Outlet Online
          </span>
        </div>

      </div>


      {/* SEARCH + FILTERS */}
      <div className="bg-white rounded-2xl border border-[#E4DDD0] shadow-[0_2px_12px_rgba(60,50,30,0.03)] overflow-hidden">

        {/* SEARCH */}
        <div className="p-4 border-b border-[#EEE8DE]">

          <div className="relative w-full">

            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#99938A]"
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search order ID, customer name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full
                h-[42px]
                pl-10
                pr-10
                text-[11px]
                font-medium
                text-[#34352F]
                bg-[#FAF8F4]
                border
                border-[#E3DDD3]
                rounded-xl
                outline-none
                placeholder:text-[#AAA49A]
                focus:bg-white
                focus:border-[#A6AA7B]
                transition-colors
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  w-6
                  h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  text-[#99938A]
                  hover:bg-[#ECE8E0]
                  hover:text-[#565F28]
                "
              >
                <X
                  className="w-[14px] h-[14px]"
                  strokeWidth={1.8}
                />
              </button>
            )}

          </div>

        </div>


        {/* STATUS FILTERS */}
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">

          <div className="flex items-center gap-1.5 mr-1 shrink-0">

            <Filter
              className="w-[13px] h-[13px] text-[#888278]"
              strokeWidth={1.8}
            />

            <span className="text-[9px] uppercase tracking-[0.12em] font-black text-[#8D887F]">
              Status
            </span>

          </div>

          {filterTabs.map((tab) => {

            const active = statusFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`
                  h-[30px]
                  px-3
                  rounded-lg
                  text-[9px]
                  font-bold
                  whitespace-nowrap
                  border
                  transition-all
                  ${
                    active
                      ? 'bg-[#565F28] border-[#565F28] text-white shadow-[0_1px_3px_rgba(50,55,20,0.12)]'
                      : 'bg-[#F8F6F1] border-[#E8E1D6] text-[#706C64] hover:bg-[#EFEBE2] hover:text-[#45463E]'
                  }
                `}
              >
                {tab.label}
              </button>
            );

          })}

        </div>

      </div>

    </div>


    {/* Orders Table Container */}
    
    <div className="bg-white rounded-3xl border border-cream-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-stone-500 uppercase tracking-wider text-[11px] font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items & Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assign Rider & WhatsApp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const meta = orderService.getStatusMeta(ord.status, ord.orderType);
                  const assignedRider = riders.find((r) => r.id === ord.riderId);

                  return (
                    <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-syzlo-charcoal block">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            ord.orderType === 'DELIVERY'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.orderType === 'PICKUP'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ord.orderType}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-syzlo-charcoal block">
                          {ord.customerName}
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {ord.customerPhone}
                        </span>
                        {ord.deliveryAddress && (
                          <span className="text-[10px] text-stone-400 block line-clamp-1 max-w-[150px]">
                            {ord.deliveryAddress.houseNo}, {ord.deliveryAddress.street}
                          </span>
                        )}
                      </td>

                      {/* Items & Value & Packaging */}
                      <td className="py-3.5 px-4">
                        <span className="text-stone-600 block line-clamp-1 max-w-[170px]">
                          {ord.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-black text-xs text-syzlo-charcoal">
                            ₹{ord.grandTotal}
                          </span>
                          {ord.packagingFee !== undefined && ord.packagingFee > 0 && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md font-bold">
                              Pack: ₹{ord.packagingFee}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </td>

                      {/* Assigned Rider & WhatsApp Dispatch */}
                      <td className="py-3.5 px-4">
                        {ord.orderType === 'DELIVERY' ? (
                          <div className="space-y-1.5">
                            <select
                              value={ord.riderId || ''}
                              onChange={(e) => assignRiderToOrder(ord.id, e.target.value)}
                              className="text-xs bg-cream-50 border border-cream-300 rounded-lg p-1 font-semibold focus:outline-hidden focus:border-olive-500 w-full max-w-[160px]"
                            >
                              <option value="">Assign Rider...</option>
                              {riders.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name} ({r.status === 'ONLINE' || r.isAvailable ? 'Free' : 'Busy'})
                                </option>
                              ))}
                            </select>

                            {/* WhatsApp Dispatch Button */}
                            {assignedRider && (
                              <div className="flex items-center gap-1">
                                <a
                                  href={generateRiderWhatsAppUrl(ord, assignedRider)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                  title="Dispatch WhatsApp message with order & location to rider"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp Rider</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleCopyDispatchText(ord, assignedRider)}
                                  className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                                  title="Copy Dispatch Text"
                                >
                                  {copiedOrderId === ord.id ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400">Counter ({ord.orderType})</span>
                        )}
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        {ord.status === 'ORDER_PLACED' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'RESTAURANT_ACCEPTED')}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            ACCEPT
                          </button>
                        )}

                        {ord.status === 'RESTAURANT_ACCEPTED' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                            className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            PREPARING
                          </button>
                        )}

                        {ord.status === 'PREPARING' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'READY')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            READY
                          </button>
                        )}

                        {ord.status === 'READY' && ord.orderType === 'DELIVERY' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'OUT_FOR_DELIVERY')}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            OUT FOR DELIVERY
                          </button>
                        )}

                        {ord.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'DELIVERED')}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            DELIVERED
                          </button>
                        )}

                        {ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'CANCELLED', 'Cancelled by admin')}
                            className="px-2 py-1 bg-stone-100 hover:bg-red-50 text-red-600 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            CANCEL
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrderForModal(ord)}
                          className="p-1 text-stone-500 hover:text-olive-700 hover:bg-cream-100 rounded-md transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal with Full WhatsApp Dispatch and Location Info */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <span className="font-mono font-black text-sm text-olive-800">
                  Order #{selectedOrderForModal.id}
                </span>
                <span className="text-xs text-stone-500 block">
                  {selectedOrderForModal.orderType} • {selectedOrderForModal.paymentMethod}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Rider WhatsApp Dispatch Card */}
            {selectedOrderForModal.orderType === 'DELIVERY' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-emerald-700" />
                    <span>Delivery Assignment & WhatsApp Dispatch</span>
                  </span>
                  {selectedOrderForModal.riderName && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedOrderForModal.riderName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrderForModal.riderId || ''}
                    onChange={(e) => {
                      assignRiderToOrder(selectedOrderForModal.id, e.target.value);
                      const assigned = riders.find((r) => r.id === e.target.value);
                      if (assigned) {
                        setSelectedOrderForModal({
                          ...selectedOrderForModal,
                          riderId: assigned.id,
                          riderName: assigned.name,
                          riderPhone: assigned.phone,
                        });
                      }
                    }}
                    className="text-xs bg-white border border-emerald-300 rounded-xl p-2 font-semibold flex-1"
                  >
                    <option value="">Choose Rider to Assign...</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} - {r.phone} ({r.status})
                      </option>
                    ))}
                  </select>

                  {selectedOrderForModal.riderId && (
                    <a
                      href={generateRiderWhatsAppUrl(
                        selectedOrderForModal,
                        riders.find((r) => r.id === selectedOrderForModal.riderId) || riders[0]
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Location Link */}
                {selectedOrderForModal.deliveryAddress?.location && (
                  <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-olive-600" />
                      Location: {selectedOrderForModal.deliveryAddress.location.lat.toFixed(4)}, {selectedOrderForModal.deliveryAddress.location.lng.toFixed(4)}
                    </span>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${selectedOrderForModal.deliveryAddress.location.lat}&mlon=${selectedOrderForModal.deliveryAddress.location.lng}#map=16/${selectedOrderForModal.deliveryAddress.location.lat}/${selectedOrderForModal.deliveryAddress.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-olive-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open in OSM</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-stone-500 block">Customer Information:</span>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-syzlo-charcoal">
                    {selectedOrderForModal.customerName} ({selectedOrderForModal.customerPhone})
                  </p>
                  <a
                    href={generateCustomerWhatsAppUrl(selectedOrderForModal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
                {selectedOrderForModal.deliveryAddress && (
                  <p className="text-stone-500 mt-1 leading-relaxed">
                    {selectedOrderForModal.deliveryAddress.houseNo},{' '}
                    {selectedOrderForModal.deliveryAddress.street},{' '}
                    {selectedOrderForModal.deliveryAddress.areaLandmark} -{' '}
                    {selectedOrderForModal.deliveryAddress.pinCode}
                  </p>
                )}
              </div>

              <div>
                <span className="font-bold text-stone-500 block mb-1">Items in this order:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedOrderForModal.items.map((it: CartItem) => (
                    <div
                      key={it.cartItemId}
                      className="p-2 bg-cream-50 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-syzlo-charcoal">
                          {it.quantity}× {it.menuItem.name}
                        </span>
                        {it.selectedAddOns.length > 0 && (
                          <span className="text-[10px] text-stone-500 block">
                            + {it.selectedAddOns.map((a: CartItemAddon) => a.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-syzlo-charcoal">₹{it.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-3 rounded-xl bg-cream-50 space-y-1 text-[11px]">
                <div className="flex justify-between text-stone-500">
                  <span>Item Total:</span>
                  <span>₹{selectedOrderForModal.itemTotal}</span>
                </div>
                {selectedOrderForModal.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{selectedOrderForModal.discount}</span>
                  </div>
                )}
                {selectedOrderForModal.deliveryFee > 0 && (
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery Fee:</span>
                    <span>₹{selectedOrderForModal.deliveryFee}</span>
                  </div>
                )}
                {selectedOrderForModal.packagingFee !== undefined && selectedOrderForModal.packagingFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>Packaging Charge:</span>
                    <span>₹{selectedOrderForModal.packagingFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Taxes (5% GST):</span>
                  <span>₹{selectedOrderForModal.tax}</span>
                </div>
                <div className="pt-1.5 border-t border-cream-200 flex justify-between font-black text-sm text-syzlo-charcoal">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrderForModal.grandTotal}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="w-full py-2.5 bg-olive-600 hover:bg-olive-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
