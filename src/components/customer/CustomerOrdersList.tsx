import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import {
  RotateCcw,
  Receipt,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Truck,
  Utensils,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const CustomerOrdersList: React.FC = () => {
  const {
    orders,
    setCustomerScreen,
    addToCart,
    brandConfig,
  } = useApp();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getOrderTypeLabel = (orderType: string) => {
    if (orderType === 'DELIVERY') return 'Delivery';
    if (orderType === 'DINE-IN') return 'Dine-in';
    return 'Takeaway';
  };

  const getOrderTypeIcon = (orderType: string) => {
    if (orderType === 'DELIVERY') {
      return <Truck className="w-4 h-4" />;
    }

    if (orderType === 'DINE-IN') {
      return <Utensils className="w-4 h-4" />;
    }

    return <ShoppingBag className="w-4 h-4" />;
  };

  const formatDate = (date: string) => {
    const value = new Date(date);

    return {
      date: value.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: value.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const downloadReceipt = (ord: any) => {
    const date = formatDate(ord.createdAt);

    const itemsHtml = ord.items
      .map(
        (item: any) => `
          <tr>
            <td>
              ${item.quantity} × ${item.menuItem.name}
              ${
                item.selectedAddOns?.length
                  ? `<br><small>Add-ons: ${item.selectedAddOns
                      .map((addon: any) => addon.name)
                      .join(', ')}</small>`
                  : ''
              }
            </td>
            <td style="text-align:right;">₹${item.totalPrice}</td>
          </tr>
        `
      )
      .join('');

    const addressHtml =
      ord.orderType === 'DELIVERY' && ord.deliveryAddress
        ? `
          <div class="section">
            <strong>Delivery Address</strong>
            <p>
              ${ord.deliveryAddress.houseNo || ''}<br>
              ${ord.deliveryAddress.street || ''}<br>
              ${ord.deliveryAddress.areaLandmark || ''}<br>
              ${ord.deliveryAddress.pinCode || ''}
            </p>
          </div>
        `
        : '';

    const dineInHtml =
      ord.orderType === 'DINE-IN' && ord.dineInTable
        ? `
          <div class="section">
            <strong>Table</strong>
            <p>${ord.dineInTable}</p>
          </div>
        `
        : '';

    const receiptWindow = window.open('', '_blank');

    if (!receiptWindow) {
      alert('Please allow pop-ups to download your receipt.');
      return;
    }

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SYZLO Receipt - ${ord.id}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              background: #f5f1e9;
              font-family: Arial, Helvetica, sans-serif;
              color: #292b23;
            }

            .receipt {
              max-width: 520px;
              margin: 0 auto;
              background: white;
              padding: 28px;
              border-radius: 18px;
            }

            .brand {
              text-align: center;
              margin-bottom: 22px;
            }

            .brand h1 {
              margin: 0;
              color: #565f28;
              font-size: 28px;
              letter-spacing: 2px;
              font-weight: 900;
            }

            .brand p {
              margin: 5px 0 0;
              color: #777;
              font-size: 12px;
            }

            .order {
              text-align: center;
              padding: 12px 0;
              border-top: 1px dashed #ccc;
              border-bottom: 1px dashed #ccc;
              margin-bottom: 18px;
            }

            .order strong {
              display: block;
              font-size: 16px;
            }

            .order span {
              display: block;
              margin-top: 5px;
              color: #777;
              font-size: 11px;
            }

            .section {
              margin: 16px 0;
              font-size: 12px;
            }

            .section strong {
              color: #565f28;
            }

            .section p {
              margin: 5px 0;
              line-height: 1.5;
              color: #555;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }

            td {
              padding: 8px 0;
              vertical-align: top;
              border-bottom: 1px solid #eee;
            }

            small {
              color: #888;
            }

            .summary {
              margin-top: 15px;
              font-size: 12px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }

            .total {
              margin-top: 8px;
              padding-top: 10px;
              border-top: 2px solid #565f28;
              font-size: 16px;
              font-weight: 900;
            }

            .footer {
              text-align: center;
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px dashed #ccc;
              color: #777;
              font-size: 10px;
              line-height: 1.6;
            }

            .print {
              display: block;
              margin: 20px auto 0;
              padding: 10px 18px;
              background: #565f28;
              color: white;
              border: 0;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }

              .receipt {
                max-width: none;
                border-radius: 0;
              }

              .print {
                display: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">

            <div class="brand">
              <h1>SYZLO</h1>
              <p>The Bao Makers</p>
            </div>

            <div class="order">
              <strong>${ord.id}</strong>
              <span>${date.date} • ${date.time}</span>
              <span>${getOrderTypeLabel(ord.orderType)}</span>
            </div>

            <div class="section">
              <strong>Customer</strong>
              <p>
                ${ord.customerName || '-'}<br>
                ${ord.customerPhone || '-'}
              </p>
            </div>

            ${addressHtml}
            ${dineInHtml}

            <table>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div class="row">
                <span>Item Total</span>
                <span>₹${ord.itemTotal}</span>
              </div>

              ${
                ord.discount > 0
                  ? `
                    <div class="row">
                      <span>Discount</span>
                      <span>-₹${ord.discount}</span>
                    </div>
                  `
                  : ''
              }

              ${
                ord.packagingFee
                  ? `
                    <div class="row">
                      <span>Packaging</span>
                      <span>₹${ord.packagingFee}</span>
                    </div>
                  `
                  : ''
              }

              ${
                ord.deliveryFee > 0
                  ? `
                    <div class="row">
                      <span>Delivery</span>
                      <span>₹${ord.deliveryFee}</span>
                    </div>
                  `
                  : ''
              }

              ${
                ord.tax > 0
                  ? `
                    <div class="row">
                      <span>Tax</span>
                      <span>₹${ord.tax}</span>
                    </div>
                  `
                  : ''
              }

              <div class="row total">
                <span>Grand Total</span>
                <span>₹${ord.grandTotal}</span>
              </div>
            </div>

            <div class="section">
              <strong>Payment</strong>
              <p>
                ${ord.paymentMethod} • ${ord.paymentStatus}
              </p>
            </div>

            <div class="footer">
              ${
                brandConfig?.fssaiLicense
                  ? `FSSAI: ${brandConfig.fssaiLicense}<br>`
                  : ''
              }
              ${brandConfig?.contactPhone || ''}<br>
              ${brandConfig?.contactEmail || ''}<br><br>
              Thank you for ordering from SYZLO.<br>
              The Bao Makers
            </div>

            <button class="print" onclick="window.print()">
              Print / Save as PDF
            </button>

          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-syzlo-charcoal tracking-tight">
              My Orders
            </h1>

            <p className="text-xs text-stone-500 mt-0.5">
              Your order history and receipts
            </p>
          </div>

          <span className="px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-xs font-bold">
            {orders.length} Orders
          </span>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 shadow-xs">

            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
              📦
            </div>

            <h3 className="font-bold text-base text-syzlo-charcoal">
              No orders yet
            </h3>

            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Your completed and current orders will appear here.
            </p>

            <button
              onClick={() => setCustomerScreen('home')}
              className="mt-4 px-5 py-2.5 bg-olive-500 text-white text-xs font-bold rounded-xl hover:bg-olive-600 transition-colors"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((ord) => {
              const statusMeta = orderService.getStatusMeta(
                ord.status,
                ord.orderType
              );

              const isExpanded = expandedOrderId === ord.id;
              const date = formatDate(ord.createdAt);

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-cream-200 shadow-xs overflow-hidden"
                >

                  {/* Order Header */}
                  <div className="p-5">

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>
                        <span className="font-mono text-xs font-black text-olive-800 bg-olive-50 px-2.5 py-1 rounded-md border border-olive-200">
                          #{ord.id}
                        </span>

                        <div className="text-[11px] text-stone-500 mt-2">
                          {date.date} • {date.time}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusMeta.color}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    {/* Order Type */}
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-stone-700">
                      <span className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-olive-700">
                        {getOrderTypeIcon(ord.orderType)}
                      </span>

                      <div>
                        <div>{getOrderTypeLabel(ord.orderType)}</div>

                        {ord.orderType === 'DINE-IN' && ord.dineInTable && (
                          <div className="text-[10px] text-stone-400 font-medium">
                            {ord.dineInTable}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-4 space-y-2">
                      {ord.items.slice(0, isExpanded ? ord.items.length : 3).map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex justify-between gap-3 text-xs"
                        >
                          <span className="text-stone-700">
                            <span className="font-bold">
                              {item.quantity}×
                            </span>{' '}
                            {item.menuItem.name}
                          </span>

                          <span className="font-semibold text-syzlo-charcoal shrink-0">
                            ₹{item.totalPrice}
                          </span>
                        </div>
                      ))}

                      {!isExpanded && ord.items.length > 3 && (
                        <div className="text-[11px] text-stone-400">
                          + {ord.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500">
                        Grand Total
                      </span>

                      <span className="font-black text-base text-syzlo-charcoal">
                        {brandConfig.currencySymbol}
                        {ord.grandTotal}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">

                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            isExpanded ? null : ord.id
                          )
                        }
                        className="px-3 py-2 bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}

                        <span>
                          {isExpanded ? 'Hide Order' : 'View Order'}
                        </span>
                      </button>

                      <button
                        onClick={() => downloadReceipt(ord)}
                        className="px-3 py-2 bg-[#565F28] hover:bg-[#474F20] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          ord.items.forEach((item) => {
                            addToCart(
                              item.menuItem,
                              item.quantity,
                              item.selectedAddOns,
                              item.specialInstructions
                            );
                          });

                          setCustomerScreen('cart');
                        }}
                        className="px-3 py-2 bg-white border border-cream-300 hover:bg-cream-100 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-[#FAF6EF] border-t border-cream-200 p-5">

                      <h3 className="text-xs font-black uppercase tracking-wider text-stone-600 mb-3">
                        Order Details
                      </h3>

                      <div className="space-y-2 text-xs">

                        <div className="flex justify-between">
                          <span className="text-stone-500">
                            Item Total
                          </span>
                          <span className="font-semibold">
                            ₹{ord.itemTotal}
                          </span>
                        </div>

                        {ord.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">
                              Discount
                            </span>
                            <span className="font-semibold text-green-700">
                              -₹{ord.discount}
                            </span>
                          </div>
                        )}

                        {ord.packagingFee && ord.packagingFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">
                              Packaging
                            </span>
                            <span className="font-semibold">
                              ₹{ord.packagingFee}
                            </span>
                          </div>
                        )}

                        {ord.deliveryFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">
                              Delivery
                            </span>
                            <span className="font-semibold">
                              ₹{ord.deliveryFee}
                            </span>
                          </div>
                        )}

                        {ord.tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">
                              Tax
                            </span>
                            <span className="font-semibold">
                              ₹{ord.tax}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-cream-200 flex justify-between">
                          <span className="font-black">
                            Grand Total
                          </span>
                          <span className="font-black">
                            ₹{ord.grandTotal}
                          </span>
                        </div>

                        <div className="pt-3 flex justify-between">
                          <span className="text-stone-500">
                            Payment
                          </span>
                          <span className="font-bold">
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </div>

                      </div>

                      {/* Status History */}
                      {ord.logs?.length > 0 && (
                        <div className="mt-5">

                          <h3 className="text-xs font-black uppercase tracking-wider text-stone-600 mb-3">
                            Order Status
                          </h3>

                          <div className="space-y-3">
                            {ord.logs.map((log, index) => (
                              <div
                                key={`${log.status}-${index}`}
                                className="flex items-start gap-3"
                              >
                                <div className="w-7 h-7 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center shrink-0">
                                  {index === ord.logs.length - 1 ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                </div>

                                <div>
                                  <div className="text-xs font-bold text-stone-800">
                                    {orderService.getStatusMeta(
                                      log.status,
                                      ord.orderType
                                    ).label}
                                  </div>

                                  <div className="text-[10px] text-stone-400">
                                    {formatDate(log.timestamp).date} •{' '}
                                    {formatDate(log.timestamp).time}
                                  </div>

                                  {log.note && (
                                    <div className="text-[10px] text-stone-500 mt-0.5">
                                      {log.note}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};
