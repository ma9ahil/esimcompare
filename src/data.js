export const PROVIDERS = [
    { id: "airalo", name: "Airalo" },
    { id: "nomad", name: "Nomad" },
    { id: "holafly", name: "Holafly" },
    { id: "ubigi", name: "Ubigi" },
  ];
  
  export const COUNTRIES = [
    ["TH", "Thailand", "🇹🇭"], ["VN", "Vietnam", "🇻🇳"], ["SG", "Singapore", "🇸🇬"], ["MY", "Malaysia", "🇲🇾"],
    ["ID", "Indonesia", "🇮🇩"], ["PH", "Philippines", "🇵🇭"], ["KH", "Cambodia", "🇰🇭"], ["LA", "Laos", "🇱🇦"],
    ["MM", "Myanmar", "🇲🇲"], ["JP", "Japan", "🇯🇵"], ["KR", "South Korea", "🇰🇷"], ["TW", "Taiwan", "🇹🇼"],
    ["HK", "Hong Kong", "🇭🇰"], ["CN", "China", "🇨🇳"], ["IN", "India", "🇮🇳"], ["AU", "Australia", "🇦🇺"],
    ["NZ", "New Zealand", "🇳🇿"], ["US", "United States", "🇺🇸"], ["CA", "Canada", "🇨🇦"], ["GB", "United Kingdom", "🇬🇧"],
    ["FR", "France", "🇫🇷"], ["DE", "Germany", "🇩🇪"], ["ES", "Spain", "🇪🇸"], ["IT", "Italy", "🇮🇹"],
    ["AE", "UAE", "🇦🇪"], ["TR", "Türkiye", "🇹🇷"], ["EG", "Egypt", "🇪🇬"], ["ZA", "South Africa", "🇿🇦"],
    ["BR", "Brazil", "🇧🇷"], ["MX", "Mexico", "🇲🇽"]
  ];
  
  export const STATIC_PLANS = [
    // Regional Asia
    {
      planId: "airalo_asia_10gb_30d", providerId: "airalo", type: "regional",
      title: "Asia Regional 10GB", price: 19, currency: "USD", dataGB: 10, validityDays: 30,
      hotspot: true, topUp: true,
      coverage: ["TH", "VN", "SG", "MY", "ID", "PH", "KH", "LA"],
      affiliateUrl: "https://example.com/airalo-asia"
    },
    {
      planId: "nomad_asia_10gb_30d", providerId: "nomad", type: "regional",
      title: "Asia Regional 10GB", price: 22, currency: "USD", dataGB: 10, validityDays: 30,
      hotspot: true, topUp: true,
      coverage: ["TH", "VN", "SG", "MY", "ID", "PH", "KH", "LA", "MM"],
      affiliateUrl: "https://example.com/nomad-asia"
    },
    {
      planId: "ubigi_asia_10gb_30d", providerId: "ubigi", type: "regional",
      title: "Asia Travel Plan 10GB", price: 24, currency: "USD", dataGB: 10, validityDays: 30,
      hotspot: true, topUp: false,
      coverage: ["TH", "VN", "SG", "MY", "ID", "PH", "KH"],
      affiliateUrl: "https://example.com/ubigi-asia"
    },
    // Unlimited by days (Asia)
    {
      planId: "holafly_asia_unlimited", providerId: "holafly", type: "unlimited",
      title: "Asia Unlimited (by days)", price: 0, pricePerDay: 3.25, currency: "USD",
      dataGB: null, validityDays: 30,
      hotspot: "limited", topUp: false,
      coverage: ["TH", "VN", "SG", "MY", "ID", "PH", "KH", "LA"],
      affiliateUrl: "https://example.com/holafly-asia"
    },
    // Global baseline
    {
      planId: "ubigi_global_5gb_30d", providerId: "ubigi", type: "global",
      title: "Global 5GB", price: 29, currency: "USD", dataGB: 5, validityDays: 30,
      hotspot: true, topUp: false, coverage: ["*"],
      affiliateUrl: "https://example.com/ubigi-global"
    },
    {
      planId: "nomad_global_10gb_30d", providerId: "nomad", type: "global",
      title: "Global 10GB", price: 49, currency: "USD", dataGB: 10, validityDays: 30,
      hotspot: true, topUp: true, coverage: ["*"],
      affiliateUrl: "https://example.com/nomad-global"
    },
  ];