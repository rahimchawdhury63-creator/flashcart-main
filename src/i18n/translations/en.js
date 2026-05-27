/**
 * =============================================================================
 * FLASHCART — English Translations
 * =============================================================================
 *
 * Purpose: Complete English language strings for the FlashCart platform.
 * 
 * Structure: Nested object organized by feature/section for easy maintenance.
 * Access pattern: t('common.search') or t('auth.login.title')
 * 
 * Used by all 3 applications via the useTranslation hook.
 * 
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

const en = {
  /* ======================================================================== */
  /* COMMON — Used across multiple pages                                      */
  /* ======================================================================== */
  common: {
    appName: 'FlashCart',
    tagline: "Bangladesh's Free Delivery Platform",
    search: 'Search',
    searchPlaceholder: 'Search for restaurants, stores, items...',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    continue: 'Continue',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    all: 'All',
    none: 'None',
    select: 'Select',
    apply: 'Apply',
    reset: 'Reset',
    clear: 'Clear',
    filter: 'Filter',
    sort: 'Sort',
    sortBy: 'Sort by',
    viewAll: 'View All',
    viewMore: 'View More',
    viewLess: 'View Less',
    showMore: 'Show More',
    showLess: 'Show Less',
    seeAll: 'See All',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    tryAgain: 'Try Again',
    retry: 'Retry',
    refresh: 'Refresh',
    share: 'Share',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    upload: 'Upload',
    print: 'Print',
    settings: 'Settings',
    notifications: 'Notifications',
    profile: 'Profile',
    account: 'Account',
    help: 'Help',
    support: 'Support',
    contact: 'Contact',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    language: 'Language',
    currency: 'BDT',
    currencySymbol: 'Tk',
    free: 'Free',
    available: 'Available',
    unavailable: 'Unavailable',
    new: 'New',
    popular: 'Popular',
    trending: 'Trending',
    recommended: 'Recommended',
    featured: 'Featured',
    sponsored: 'Sponsored',
    open: 'Open',
    closed: 'Closed',
    online: 'Online',
    offline: 'Offline',
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled',
    inProgress: 'In Progress',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    poweredBy: 'Powered by',
    developedBy: 'Developed by',
    minutes: 'min',
    hours: 'hr',
    km: 'km',
    away: 'away',
    rating: 'Rating',
    review: 'Review',
    reviews: 'Reviews',
    star: 'star',
    stars: 'stars',
    item: 'item',
    items: 'items',
    order: 'Order',
    orders: 'Orders',
    customer: 'Customer',
    customers: 'Customers',
    partner: 'Partner',
    partners: 'Partners',
    store: 'Store',
    stores: 'Stores',
    restaurant: 'Restaurant',
    restaurants: 'Restaurants',
    category: 'Category',
    categories: 'Categories',
    product: 'Product',
    products: 'Products',
    menu: 'Menu',
    cart: 'Cart',
    checkout: 'Checkout',
    delivery: 'Delivery',
    address: 'Address',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    fullName: 'Full Name',
    welcomeBack: 'Welcome Back',
    welcome: 'Welcome'
  },

  /* ======================================================================== */
  /* NAVIGATION                                                                */
  /* ======================================================================== */
  nav: {
    home: 'Home',
    search: 'Search',
    explore: 'Explore',
    nearby: 'Nearby',
    orders: 'Orders',
    cart: 'Cart',
    profile: 'Profile',
    favorites: 'Favorites',
    history: 'History',
    notifications: 'Notifications',
    settings: 'Settings',
    help: 'Help',
    docs: 'Documentation',
    partner: 'Become a Partner',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Sign Out'
  },

  /* ======================================================================== */
  /* AUTHENTICATION                                                            */
  /* ======================================================================== */
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue ordering from your favorite shops',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      loginButton: 'Sign In',
      loginWithGoogle: 'Continue with Google',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
      orContinueWith: 'Or continue with',
      seoTitle: 'Login - FlashCart | Free Delivery Platform Bangladesh',
      seoDescription: 'Sign in to FlashCart and order from your favorite local shops with Cash on Delivery. Free delivery platform for Bangladesh.'
    },
    register: {
      title: 'Create Your Account',
      subtitle: 'Join FlashCart and discover thousands of local shops',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '01XXXXXXXXX',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a strong password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      acceptTerms: 'I agree to the Terms of Service and Privacy Policy',
      registerButton: 'Create Account',
      registerWithGoogle: 'Sign up with Google',
      haveAccount: 'Already have an account?',
      loginLink: 'Sign in',
      seoTitle: 'Sign Up - FlashCart | Join Bangladesh\'s Free Delivery Platform',
      seoDescription: 'Create your free FlashCart account and start ordering food, groceries, and more from local shops in Bangladesh with Cash on Delivery.'
    },
    forgotPassword: {
      title: 'Reset Your Password',
      subtitle: 'Enter your email and we\'ll send you a link to reset your password',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your registered email',
      sendButton: 'Send Reset Link',
      backToLogin: 'Back to login',
      successTitle: 'Email Sent!',
      successMessage: 'We\'ve sent a password reset link to your email. Please check your inbox.',
      seoTitle: 'Reset Password - FlashCart',
      seoDescription: 'Reset your FlashCart account password securely.'
    },
    verifyEmail: {
      title: 'Verify Your Email',
      subtitle: 'We\'ve sent a verification link to your email address. Please click the link to verify your account.',
      resendButton: 'Resend Verification Email',
      checkSpam: 'Can\'t find the email? Check your spam folder.',
      verified: 'Your email has been verified!',
      continueShopping: 'Continue Shopping'
    },
    passwordStrength: {
      weak: 'Weak password',
      medium: 'Medium strength',
      strong: 'Strong password',
      veryStrong: 'Very strong password',
      requirements: {
        length: 'At least 8 characters',
        uppercase: 'One uppercase letter',
        lowercase: 'One lowercase letter',
        number: 'One number',
        special: 'One special character (@#$%^&*)'
      }
    },
    errors: {
      invalidEmail: 'Please enter a valid email address',
      invalidPassword: 'Password must be at least 8 characters',
      passwordsDoNotMatch: 'Passwords do not match',
      userNotFound: 'No account found with this email',
      wrongPassword: 'Incorrect password. Please try again',
      emailInUse: 'This email is already registered',
      weakPassword: 'Password is too weak',
      networkError: 'Network error. Please check your connection',
      tooManyRequests: 'Too many attempts. Please try again later',
      googleSignInFailed: 'Google sign-in failed. Please try again',
      genericError: 'Something went wrong. Please try again'
    }
  },

  /* ======================================================================== */
  /* HOME PAGE                                                                 */
  /* ======================================================================== */
  home: {
    seoTitle: 'FlashCart - Order Food, Grocery, Medicine Online | Free Delivery Bangladesh',
    seoDescription: 'Bangladesh\'s first free all-in-one delivery platform. Order from local restaurants, grocery stores, pharmacies, and more. Cash on Delivery. Fast delivery across Bangladesh.',
    hero: {
      title: 'Order Anything, Anytime',
      subtitle: 'From your favorite local shops to your doorstep',
      searchPlaceholder: 'Enter your delivery address',
      searchButton: 'Find Shops Nearby',
      tagline: 'Cash on Delivery | Free for Shops | Available across Bangladesh'
    },
    categories: {
      title: 'What are you looking for?',
      subtitle: 'Browse by category',
      restaurant: 'Restaurants',
      grocery: 'Grocery',
      medical: 'Medicine',
      electronics: 'Electronics',
      clothing: 'Clothing',
      books: 'Books',
      mobile: 'Mobile Phones',
      homeKitchen: 'Home Kitchen',
      supermarket: 'Supermarket',
      other: 'Others'
    },
    nearby: {
      title: 'Shops Near You',
      subtitle: 'Discover popular shops in your area',
      noStores: 'No stores found in your area yet',
      enableLocation: 'Enable location to see nearby stores'
    },
    featured: {
      title: 'Featured Today',
      subtitle: 'Hand-picked items just for you'
    },
    topRated: {
      title: 'Top Rated Shops',
      subtitle: 'Customer favorites in your area'
    },
    recentlyViewed: {
      title: 'Recently Viewed',
      subtitle: 'Pick up where you left off'
    },
    forYou: {
      title: 'For You',
      subtitle: 'Based on your taste'
    },
    becomePartner: {
      title: 'Are You a Shop Owner?',
      subtitle: 'Join FlashCart for free and grow your business online',
      cta: 'Become a Partner',
      benefits: {
        free: '100% Free to Join',
        seo: 'SEO-Optimized Store Page',
        notifications: 'Real-time Order Notifications',
        analytics: 'Powerful Analytics Dashboard'
      }
    }
  },

  /* ======================================================================== */
  /* STORE & PRODUCT PAGES                                                     */
  /* ======================================================================== */
  store: {
    open: 'Open Now',
    closed: 'Closed',
    openingHours: 'Opening Hours',
    deliveryTime: 'Delivery Time',
    minOrder: 'Min. Order',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'Free Delivery',
    distance: 'Distance',
    info: 'Store Info',
    reviews: 'Reviews',
    menu: 'Menu',
    aboutStore: 'About Store',
    callStore: 'Call Store',
    getDirections: 'Get Directions',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    shareStore: 'Share Store',
    storeClosed: 'This store is currently closed',
    deliveryAvailable: 'Delivery Available',
    deliveryNotAvailable: 'Sorry, delivery not available to your location',
    allBangladesh: 'Delivers across Bangladesh',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to cart',
    quantity: 'Quantity',
    description: 'Description',
    ingredients: 'Ingredients',
    nutritionalInfo: 'Nutritional Information',
    allergens: 'Allergens',
    relatedItems: 'You might also like',
    moreFromStore: 'More from this store',
    perItem: 'per item',
    save: 'Save',
    off: 'OFF'
  },

  /* ======================================================================== */
  /* CART & CHECKOUT                                                           */
  /* ======================================================================== */
  cart: {
    title: 'Your Cart',
    empty: 'Your cart is empty',
    emptyMessage: 'Looks like you haven\'t added anything to your cart yet',
    startShopping: 'Start Shopping',
    item: 'item',
    items: 'items',
    subtotal: 'Subtotal',
    deliveryCharge: 'Delivery Charge',
    serviceCharge: 'Service Charge',
    discount: 'Discount',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    removeItem: 'Remove item',
    updateQuantity: 'Update quantity',
    saveForLater: 'Save for later',
    estimatedDelivery: 'Estimated delivery',
    minimumOrder: 'Minimum order amount',
    addMoreItems: 'Add more items to reach minimum order'
  },

  checkout: {
    title: 'Checkout',
    deliveryAddress: 'Delivery Address',
    selectAddress: 'Select delivery address',
    addNewAddress: 'Add new address',
    editAddress: 'Edit address',
    contactInfo: 'Contact Information',
    name: 'Name',
    phone: 'Phone Number',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    codDescription: 'Pay with cash when your order arrives',
    orderSummary: 'Order Summary',
    specialInstructions: 'Special Instructions (Optional)',
    instructionsPlaceholder: 'Any special requests for the store or delivery person?',
    placeOrder: 'Place Order',
    placing: 'Placing your order...',
    termsAgree: 'By placing this order, you agree to our Terms of Service',
    deliveryEstimate: 'Estimated delivery in {minutes} minutes',
    orderTotal: 'Order Total'
  },

  /* ======================================================================== */
  /* ORDERS                                                                    */
  /* ======================================================================== */
  orders: {
    myOrders: 'My Orders',
    activeOrders: 'Active Orders',
    pastOrders: 'Past Orders',
    orderHistory: 'Order History',
    orderNumber: 'Order #',
    orderDate: 'Order Date',
    orderTime: 'Order Time',
    orderTotal: 'Order Total',
    orderItems: 'Order Items',
    orderStatus: 'Order Status',
    trackOrder: 'Track Order',
    reorder: 'Reorder',
    cancelOrder: 'Cancel Order',
    downloadInvoice: 'Download Invoice',
    rateOrder: 'Rate Order',
    contactStore: 'Contact Store',
    noOrders: 'No orders yet',
    noOrdersMessage: 'Your order history will appear here',
    confirmation: {
      title: 'Order Placed Successfully!',
      message: 'Your order has been received and the store will start preparing it shortly.',
      orderId: 'Order ID',
      estimatedTime: 'Estimated delivery time',
      trackButton: 'Track Your Order'
    },
    status: {
      placed: 'Order Placed',
      confirmed: 'Order Confirmed',
      preparing: 'Preparing',
      ready: 'Ready for Pickup',
      onTheWay: 'On the Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    tracking: {
      title: 'Track Your Order',
      orderPlaced: 'Order placed at {time}',
      orderConfirmed: 'Order confirmed by store',
      preparing: 'Your order is being prepared',
      ready: 'Order is ready for delivery',
      onTheWay: 'Your order is on the way',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
      contactInfo: 'Contact Information',
      deliveryDetails: 'Delivery Details'
    }
  },

  /* ======================================================================== */
  /* PROFILE                                                                   */
  /* ======================================================================== */
  profile: {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    editProfile: 'Edit Profile',
    changePhoto: 'Change Photo',
    addresses: 'Saved Addresses',
    favorites: 'Favorites',
    orderHistory: 'Order History',
    notifications: 'Notification Settings',
    language: 'Language Preference',
    aboutApp: 'About App',
    helpSupport: 'Help & Support',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    appVersion: 'App Version',
    languageOptions: {
      default: 'Default (Bangla-English Mix)',
      bangla: 'Bangla',
      english: 'English'
    },
    addressLabels: {
      home: 'Home',
      office: 'Office',
      other: 'Other'
    }
  },

  /* ======================================================================== */
  /* REVIEWS                                                                   */
  /* ======================================================================== */
  reviews: {
    writeReview: 'Write a Review',
    yourRating: 'Your Rating',
    yourComment: 'Your Comment',
    commentPlaceholder: 'Tell others about your experience...',
    addPhotos: 'Add Photos (Optional)',
    submit: 'Submit Review',
    reviewSubmitted: 'Thank you for your review!',
    helpfulReview: 'Was this review helpful?',
    helpful: 'Helpful',
    notHelpful: 'Not Helpful',
    reportReview: 'Report Review',
    verifiedPurchase: 'Verified Purchase',
    noReviews: 'No reviews yet',
    beFirstToReview: 'Be the first to review',
    storeReply: 'Store Reply'
  },

  /* ======================================================================== */
  /* LOCATION                                                                  */
  /* ======================================================================== */
  location: {
    permissionTitle: 'Enable Location',
    permissionMessage: 'FlashCart needs your location to show shops and restaurants near you. Your location is never shared with anyone.',
    enableButton: 'Enable Location',
    skipButton: 'Skip for Now',
    deniedTitle: 'Location Access Denied',
    deniedMessage: 'Without location access, we can\'t show you nearby shops. Please enable location in your browser settings.',
    openSettings: 'Open Settings',
    detecting: 'Detecting your location...',
    locationFound: 'Location detected',
    locationError: 'Could not detect location',
    enterManually: 'Enter address manually',
    currentLocation: 'Use current location',
    savedAddresses: 'Saved Addresses',
    selectOnMap: 'Select on map',
    confirmLocation: 'Confirm Location',
    searchPlaceholder: 'Search for area, road, or landmark',
    deliveryTo: 'Deliver to',
    changeAddress: 'Change Address'
  },

  /* ======================================================================== */
  /* NOTIFICATIONS                                                             */
  /* ======================================================================== */
  notifications: {
    title: 'Notifications',
    enableTitle: 'Enable Notifications',
    enableMessage: 'Get instant updates about your orders, special offers, and more',
    enableButton: 'Enable Notifications',
    skipButton: 'Skip for Now',
    noNotifications: 'No notifications yet',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',
    orderUpdates: 'Order Updates',
    promotions: 'Promotions & Offers',
    newStores: 'New Stores in Your Area',
    permissionDenied: 'Notifications are blocked. Please enable them in your browser settings to receive order updates.'
  },

  /* ======================================================================== */
  /* FOOTER                                                                    */
  /* ======================================================================== */
  footer: {
    aboutFlashCart: 'About FlashCart',
    aboutText: 'FlashCart is Bangladesh\'s first free all-in-one delivery platform. Connecting local shops with customers across the country.',
    quickLinks: 'Quick Links',
    forCustomers: 'For Customers',
    forPartners: 'For Partners',
    resources: 'Resources',
    company: 'Company',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    downloadApp: 'Download App',
    availableOn: 'Available on',
    copyright: 'All rights reserved.',
    developedBy: 'Developed by',
    poweredBy: 'Powered by'
  },

  /* ======================================================================== */
  /* PWA INSTALL                                                               */
  /* ======================================================================== */
  pwa: {
    installTitle: 'Install FlashCart',
    installMessage: 'Install our app for a faster experience and offline access',
    installButton: 'Install Now',
    dismissButton: 'Maybe Later',
    updateAvailable: 'A new version is available',
    updateButton: 'Update Now'
  },

  /* ======================================================================== */
  /* ERRORS & EMPTY STATES                                                     */
  /* ======================================================================== */
  errors: {
    pageNotFound: 'Page Not Found',
    pageNotFoundMessage: 'The page you\'re looking for doesn\'t exist or has been moved',
    goHome: 'Go to Homepage',
    somethingWentWrong: 'Something went wrong',
    tryAgainLater: 'Please try again later',
    noInternet: 'No Internet Connection',
    checkConnection: 'Please check your internet connection and try again',
    offline: 'You\'re Offline',
    offlineMessage: 'Some features may not be available while you\'re offline'
  }
};

export default en;
