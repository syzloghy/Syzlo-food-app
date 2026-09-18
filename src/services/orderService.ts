import { CartItem, Coupon, CustomerOrder, OrderType, AppBrandConfig } from '../types';

class OrderService {
  private onlineOrderCounter: number = 3;
  private posOrderCounter: number = 1803;

  /**
   * Generates formatted order ID according to the business rules:
   * Online: SYZ/MM/DD01 (e.g., SYZ/09/18/03)
   * POS: 1801, 1802, 1803
   */
  public generateOrderId(isPOS: boolean = false): string {
    if (isPOS) {
      const id = `${this.posOrderCounter}`;
      this.posOrderCounter += 1;
      return id;
    }

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const seq = String(this.onlineOrderCounter).padStart(2, '0');
    this.onlineOrderCounter += 1;
    return `SYZ/${mm}/${dd}/${seq}`;
  }

  /**
   * Computes totals including taxes (5% GST for restaurants), delivery fee, and packaging fee
   */
  public isCouponValidForOrderType(coupon: Coupon, orderType: OrderType): { valid: boolean; reason?: string } {
    if (!coupon.active && coupon.isActive === false) {
      return { valid: false, reason: 'This coupon is no longer active.' };
    }
    if (coupon.applicableMode && coupon.applicableMode !== 'ALL' && coupon.applicableMode !== orderType) {
      return {
        valid: false,
        reason: `Coupon "${coupon.code}" is only valid for ${coupon.applicableMode} orders. (Current order mode is ${orderType})`,
      };
    }
    return { valid: true };
  }

  public calculateOrderBreakdown(
    items: CartItem[],
    orderType: OrderType,
    coupon: Coupon | null,
    deliveryFeeAmount: number = 40,
    brandConfig?: Partial<AppBrandConfig>
  ) {
    const itemTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    let discount = 0;
    const isModeAllowed = !coupon || !coupon.applicableMode || coupon.applicableMode === 'ALL' || coupon.applicableMode === orderType;

    if (coupon && (coupon.active ?? coupon.isActive ?? true) && isModeAllowed && itemTotal >= coupon.minOrder) {
      const maxDiscount = coupon.maxDiscount ?? 9999;
      if (coupon.discountType === 'PERCENT' || (coupon.discountType as string) === 'PERCENTAGE') {
        discount = Math.min((itemTotal * coupon.discountValue) / 100, maxDiscount);
      } else {
        discount = Math.min(coupon.discountValue, maxDiscount);
      }
    }

    const deliveryFee = orderType === 'DELIVERY' ? (coupon?.code === 'FREEDEL' && itemTotal >= coupon.minOrder ? 0 : deliveryFeeAmount) : 0;
    
    // Packaging fee management based on order mode
    let packagingFee = 0;
    const packagingEnabled = brandConfig?.isPackagingChargeEnabled ?? true;
    if (packagingEnabled && items.length > 0) {
      if (orderType === 'PICKUP') {
        packagingFee = brandConfig?.packagingChargeTakeaway ?? 20;
      } else if (orderType === 'DELIVERY') {
        packagingFee = brandConfig?.packagingChargeDelivery ?? 15;
      } else if (orderType === 'DINE-IN') {
        packagingFee = brandConfig?.packagingChargeDineIn ?? 0;
      }
    }

    const taxableAmount = Math.max(0, itemTotal - discount);
    const tax = Math.round(taxableAmount * 0.05 * 100) / 100; // 5% GST
    const grandTotal = Math.round((taxableAmount + deliveryFee + packagingFee + tax) * 100) / 100;

    return {
      itemTotal,
      discount,
      deliveryFee,
      packagingFee,
      tax,
      grandTotal,
    };
  }

  /**
   * Get display badge info for each status
   */
  public getStatusMeta(status: CustomerOrder['status'], orderType: OrderType = 'DELIVERY') {
    switch (status) {
      case 'ORDER_PLACED':
        return { label: 'Order Placed', color: 'bg-amber-100 text-amber-900 border-amber-300', step: 1 };
      case 'RESTAURANT_ACCEPTED':
        return { label: 'Restaurant Accepted', color: 'bg-blue-100 text-blue-900 border-blue-300', step: 2 };
      case 'PREPARING':
        return { label: 'In the Kitchen', color: 'bg-orange-100 text-orange-900 border-orange-300', step: 3 };
      case 'READY':
        return {
          label: orderType === 'PICKUP' ? 'Ready for Pickup' : orderType === 'DINE-IN' ? 'Ready to Serve' : 'Ready for Rider',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          step: 4,
        };
      case 'RIDER_ASSIGNED':
        return { label: 'Rider Assigned', color: 'bg-indigo-100 text-indigo-900 border-indigo-300', step: 5 };
      case 'PICKED_UP':
        return {
          label: orderType === 'PICKUP' ? 'Picked Up' : 'Picked Up by Rider',
          color: 'bg-teal-100 text-teal-900 border-teal-300',
          step: 6,
        };
      case 'OUT_FOR_DELIVERY':
        return { label: 'Out for Delivery', color: 'bg-olive-100 text-olive-800 border-olive-400', step: 7 };
      case 'DELIVERED':
        return {
          label: orderType === 'PICKUP' ? 'Picked Up / Completed' : orderType === 'DINE-IN' ? 'Served / Completed' : 'Delivered',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          step: 8,
        };
      case 'CANCELLED':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-900 border-red-300', step: 0 };
      default:
        return { label: status, color: 'bg-stone-100 text-stone-800 border-stone-300', step: 1 };
    }
  }
}

export const orderService = new OrderService();
