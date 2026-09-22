export type FoodCategory = 'ALL' | 'BAO' | 'COMBOS' | 'CHINESE' | 'STARTERS' | 'DRINKS';

export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE-IN';

export type CouponApplicableMode = 'ALL' | 'DELIVERY' | 'PICKUP' | 'DINE-IN';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'RESTAURANT_ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CASH' | 'RAZORPAY' | 'CASHFREE';

export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface GlobalAddon {
  id: string;
  name: string;
  price: number;
  category: 'Sauces & Dips' | 'Sides & Crunch' | 'Extra Fillings' | 'Beverages';
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<FoodCategory, 'ALL'>;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isBestseller?: boolean;
  image: string;
  addOns: AddOn[];
  isAvailable: boolean;
}

export interface CategoryConfig {
  id: Exclude<FoodCategory, 'ALL'>;
  name: string;
  description: string;
  image: string;
  icon: string;
  isActive: boolean;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  couponCode?: string;
  ctaText: string;
  ctaCategory?: FoodCategory;
  bgColor?: string;
  isActive: boolean;
}

export type SupportedPaymentGateway = 'RAZORPAY' | 'CASHFREE' | 'UPI_QR' | 'CASH_ON_DELIVERY';

export interface PaymentGatewayConfig {
  id: SupportedPaymentGateway;
  name: string;
  description: string;
  isEnabled: boolean;
  isTestMode: boolean;
  keyId?: string;
  secretKey?: string;
  appId?: string;
  merchantVpa?: string;
  icon?: string;
}

export interface AppBrandConfig {
  brandName: string;
  tagline: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  restaurantAddress: string;
  openingHours: string;
  currencySymbol: string;
  fssaiLicense?: string;
  gstin?: string;
  packagingChargeTakeaway?: number;
  packagingChargeDelivery?: number;
  packagingChargeDineIn?: number;
  isPackagingChargeEnabled?: boolean;
}

export interface OsmMapConfig {
  centerLat: number;
  centerLng: number;
  zoom: number;
  deliveryRadiusKm: number;
  tileUrl: string;
  attribution: string;
  kitchenAddress?: string;
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddOns: CartItemAddon[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryAddress {
  id?: string;
  label: 'HOME' | 'WORK' | 'OTHER';
  houseNo: string;
  street: string;
  areaLandmark: string;
  pinCode: string;
  latitude?: number;
  longitude?: number;
  location?: {
    lat: number;
    lng: number;
  };
  isDefault?: boolean;
}

export interface OrderStatusLog {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface CustomerOrder {
  id: string; // e.g. SYZ/09/18/01 or 1801
  source: 'ONLINE' | 'POS';
  orderType: OrderType;
  items: CartItem[];
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  packagingFee?: number;
  tax: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: DeliveryAddress;
  dineInTable?: string;
  specialInstructions?: string;
  estimatedMinutes: number;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderLocation?: {
    lat: number;
    lng: number;
  };
  logs: OrderStatusLog[];
}

export type Order = CustomerOrder;

export interface Rider {
  id: string;
  userId?: string;
  name: string;
  phone: string;

  vehicle: string;
  vehicleNumber?: string;

  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  isAvailable?: boolean;

  currentOrderId?: string;

  // Kept for compatibility with existing code.
  // Live rider tracking is NOT used in the new system.
  location: {
    lat: number;
    lng: number;
  };

  completedDeliveries: number;
  totalDeliveries?: number;
  rating: number;
  batteryLevel?: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrder: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  active?: boolean;
  isActive?: boolean;
  usageCount?: number;
  expiryDate?: string;
  applicableMode?: CouponApplicableMode;
}

export type StaffRole = 'ADMIN' | 'MANAGER' | 'KITCHEN' | 'CASHIER' | 'RIDER';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  status: 'ACTIVE' | 'ON_LEAVE';
  shift: string;
  branch?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: DeliveryAddress[];
  savedFavorites: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}
