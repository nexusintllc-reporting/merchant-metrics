// // ==================== IMPORTS ====================
// import { LoaderFunctionArgs, json } from "@remix-run/node";
// import { useLoaderData, useNavigation, Link } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import "../styles/products.css";
// import { useState } from 'react';

// // ==================== LOADING COMPONENT ====================
// function LoadingProgress() {
//   const loadingSteps = [
//     "Scanning products...",
//     "Analyzing inventory...", 
//     "Checking SEO...",
//     "Processing collections...",
//     "Generating analytics..."
//   ];

//   return (
//     <div className="loading-progress-container">
//       <div className="loading-header">
//         <h2>Preparing Your Products Dashboard</h2>
//         <p>This may take 20-30 seconds as we analyze your entire product catalog</p>
//       </div>
      
//       <div className="progress-bar-container">
//         <div className="progress-bar">
//           <div className="progress-fill"></div>
//         </div>
//       </div>

//       <div className="loading-steps">
//         {loadingSteps.map((step, index) => (
//           <div key={index} className="loading-step">
//             <div className="step-indicator">⟳</div>
//             <div className="step-text">{step}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ==================== TYPES ====================
// interface ProductsData {
//   totalProducts: number;
//   activeProducts: number;
//   newProductsThisMonth: number;
//   totalCollections: number;
//   collectionsWithCounts: any[];
//   collectionStats: {
//     totalCollections: number;
//     collectionsWithProducts: number;
//     emptyCollections: number;
//     averageProductsPerCollection: number;
//     largestCollection: any;
//   };
//   enhancedMetrics: {
//     inventory: { 
//       totalVariants: number; 
//       outOfStock: number; 
//       lowStock: number; 
//       inventoryValue: number;
//       outOfStockProducts: any[];
//       lowStockProducts: any[];
//     };
//     statusBreakdown: { draft: number; active: number; archived: number };
//     productTimeline: { last30Days: number; last90Days: number; thisYear: number };
//     seoInsights: { 
//       missingMeta: number; 
//       shortTitles: number; 
//       missingImages: number;
//       seoScore: number;
//       missingMetaProducts: any[];
//       shortTitleProducts: any[];
//       missingImageProducts: any[];
//     };
//     optimizationScore: number;
//   };
//   insights: {
//     needsAttention: number;
//     growthOpportunity: number;
//     seoImprovements: number;
//   };
//   shop: string;
//   chartData: {
//     statusData: { activePercentage: number; draftPercentage: number; archivedPercentage: number };
//     topCollections: any[];
//     monthlyData: { labels: string[]; data: number[] };
//   };
//   productsLoaded: number;
// }

// // ==================== HELPER FUNCTIONS ====================

// // Your original helper functions - kept exactly the same
// async function fetchAllCollectionProducts(admin: any, collectionId: string) {
//   let allProducts: any[] = [];
//   let after = null;
//   let hasMore = true;

//   while (hasMore) {
//     const productsQuery = after 
//       ? `products(first: 250, after: "${after}")`
//       : `products(first: 250)`;

//     const response = await admin.graphql(`
//       query collectionProducts($id: ID!) {
//         collection(id: $id) {
//           ${productsQuery} {
//             edges {
//               node {
//                 id
//               }
//               cursor
//             }
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//           }
//         }
//       }
//     `, {
//       variables: { id: collectionId }
//     });

//     const data = await response.json() as any;
//     const products = data.data?.collection?.products?.edges || [];
//     const pageInfo = data.data?.collection?.products?.pageInfo;

//     allProducts = [...allProducts, ...products];
//     after = pageInfo?.endCursor;
//     hasMore = pageInfo?.hasNextPage;

//     // Safety limit
//     if (allProducts.length >= 1000) break;
//   }

//   return allProducts.length;
// }

// // Enhanced inventory metrics function with detailed product tracking
// async function getInventoryMetrics(admin: any, allProducts: any[]) {
//   let totalVariants = 0;
//   let outOfStockCount = 0;
//   let lowStockCount = 0;
//   let totalInventoryValue = 0;
  
//   // Track specific products that need attention
//   const outOfStockProducts: any[] = [];
//   const lowStockProducts: any[] = [];
  
//   // Sample a subset of products for performance
//   const sampleProducts = allProducts.slice(0, 50);
  
//   for (const product of sampleProducts) {
//     try {
//       const variantsResponse = await admin.graphql(`
//         query productVariants($id: ID!) {
//           product(id: $id) {
//             title
//             handle
//             variants(first: 10) {
//               edges {
//                 node {
//                   inventoryQuantity
//                   price
//                   sku
//                   title
//                 }
//               }
//             }
//           }
//         }
//       `, {
//         variables: { id: product.node.id }
//       });
      
//       const variantsData = await variantsResponse.json() as any;
//       const variants = variantsData.data?.product?.variants?.edges || [];
      
//       let productOutOfStock = false;
//       let productLowStock = false;
      
//       variants.forEach((variant: any) => {
//         totalVariants++;
//         const quantity = variant.node.inventoryQuantity || 0;
//         const price = parseFloat(variant.node.price) || 0;
        
//         if (quantity === 0) {
//           outOfStockCount++;
//           productOutOfStock = true;
//         }
//         if (quantity > 0 && quantity <= 5) {
//           lowStockCount++;
//           productLowStock = true;
//         }
//         totalInventoryValue += quantity * price;
//       });

//       // Track which specific products need attention
//       if (productOutOfStock) {
//         outOfStockProducts.push({
//           title: variantsData.data?.product?.title,
//           handle: variantsData.data?.product?.handle,
//           type: 'out_of_stock'
//         });
//       } else if (productLowStock) {
//         lowStockProducts.push({
//           title: variantsData.data?.product?.title,
//           handle: variantsData.data?.product?.handle,
//           type: 'low_stock'
//         });
//       }
      
//     } catch (error) {
//       console.error(`Error fetching variants for product ${product.node.id}:`, error);
//     }
//   }
  
//   // Extrapolate for all products
//   const sampleRatio = sampleProducts.length / Math.max(allProducts.length, 1);
  
//   return {
//     totalVariants: Math.round(totalVariants / Math.max(sampleRatio, 0.1)),
//     outOfStock: Math.round(outOfStockCount / Math.max(sampleRatio, 0.1)),
//     lowStock: Math.round(lowStockCount / Math.max(sampleRatio, 0.1)),
//     inventoryValue: Math.round(totalInventoryValue / Math.max(sampleRatio, 0.1)),
//     outOfStockProducts: outOfStockProducts.slice(0, 10),
//     lowStockProducts: lowStockProducts.slice(0, 10),
//   };
// }

// // Your original status breakdown function
// function getProductStatusBreakdown(allProducts: any[]) {
//   const statusCounts = {
//     draft: 0,
//     active: 0,
//     archived: 0,
//   };
  
//   allProducts.forEach((product: any) => {
//     switch (product.node.status) {
//       case 'DRAFT': statusCounts.draft++; break;
//       case 'ACTIVE': statusCounts.active++; break;
//       case 'ARCHIVED': statusCounts.archived++; break;
//     }
//   });
  
//   return statusCounts;
// }

// // Your original timeline function
// function getProductTimeline(allProducts: any[]) {
//   const last30Days = new Date();
//   last30Days.setDate(last30Days.getDate() - 30);
//   const last90Days = new Date();
//   last90Days.setDate(last90Days.getDate() - 90);
  
//   return {
//     last30Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last30Days).length,
//     last90Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last90Days).length,
//     thisYear: allProducts.filter((p: any) => new Date(p.node.createdAt).getFullYear() === new Date().getFullYear()).length,
//   };
// }

// // Enhanced SEO insights with detailed product tracking
// function getSEOInsights(allProducts: any[]) {
//   const productsWithMissingMeta = allProducts.filter((p: any) => 
//     !p.node.description || p.node.description.trim().length < 50
//   );
  
//   const productsWithShortTitles = allProducts.filter((p: any) => 
//     !p.node.title || p.node.title.length < 10
//   );

//   const productsWithMissingImages = allProducts.filter((p: any) => 
//     !p.node.featuredImage?.url
//   );
  
//   return {
//     missingMeta: productsWithMissingMeta.length,
//     shortTitles: productsWithShortTitles.length,
//     missingImages: productsWithMissingImages.length,
//     seoScore: Math.max(0, 100 - (productsWithMissingMeta.length / Math.max(allProducts.length, 1) * 100)),
//     missingMetaProducts: productsWithMissingMeta.slice(0, 10).map((p: any) => ({
//       title: p.node.title,
//       id: p.node.id
//     })),
//     shortTitleProducts: productsWithShortTitles.slice(0, 10).map((p: any) => ({
//       title: p.node.title,
//       id: p.node.id
//     })),
//     missingImageProducts: productsWithMissingImages.slice(0, 10).map((p: any) => ({
//       title: p.node.title,
//       id: p.node.id
//     }))
//   };
// }

// // Your original optimization score function
// function calculateOptimizationScore(mainData: any, inventory: any, seoInsights: any, statusBreakdown: any) {
//   let score = 0;
  
//   // Active product rate (30% of score)
//   const activeRate = mainData.totalProducts > 0 ? (mainData.activeProducts / mainData.totalProducts) * 100 : 0;
//   score += (activeRate / 100) * 30;
  
//   // Collection utilization (20% of score)
//   const collectionUtilization = mainData.totalCollections > 0 ? 
//     (mainData.collectionStats.collectionsWithProducts / mainData.totalCollections) * 100 : 0;
//   score += (collectionUtilization / 100) * 20;
  
//   // Inventory health (30% of score)
//   const inventoryHealth = inventory.totalVariants > 0 ? 
//     (1 - (inventory.outOfStock / inventory.totalVariants)) * 100 : 100;
//   score += (inventoryHealth / 100) * 30;
  
//   // Recent activity (20% of score)
//   const recentProducts = mainData.newProductsThisMonth;
//   const recentScore = Math.min(20, (recentProducts / 10) * 20);
//   score += recentScore;
  
//   return Math.round(Math.min(100, score));
// }

// // Your original chart data functions
// function generateChartData(allProducts: any[], collectionsWithCounts: any[], statusBreakdown: any) {
//   // Product Status Pie Chart Data with REAL percentages
//   const total = statusBreakdown.active + statusBreakdown.draft + statusBreakdown.archived;
//   const activePercentage = total > 0 ? (statusBreakdown.active / total) * 100 : 0;
//   const draftPercentage = total > 0 ? (statusBreakdown.draft / total) * 100 : 0;
//   const archivedPercentage = total > 0 ? (statusBreakdown.archived / total) * 100 : 0;

//   // Collections Bar Chart Data
//   const topCollections = [...collectionsWithCounts]
//     .sort((a: any, b: any) => b.productCount - a.productCount)
//     .slice(0, 8);
  
//   // Monthly Product Growth Line Chart Data
//   const monthlyData = generateMonthlyProductData(allProducts);

//   return {
//     statusData: {
//       activePercentage,
//       draftPercentage,
//       archivedPercentage
//     },
//     topCollections,
//     monthlyData
//   };
// }

// function generateMonthlyProductData(allProducts: any[]) {
//   const monthlyCounts: { [key: string]: number } = {};
//   const currentYear = new Date().getFullYear();
  
//   // Initialize last 6 months
//   for (let i = 5; i >= 0; i--) {
//     const date = new Date();
//     date.setMonth(date.getMonth() - i);
//     const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
//     monthlyCounts[key] = 0;
//   }
  
//   // Count products by month
//   allProducts.forEach((product: any) => {
//     const productDate = new Date(product.node.createdAt);
//     if (productDate.getFullYear() === currentYear) {
//       const key = productDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
//       if (monthlyCounts[key] !== undefined) {
//         monthlyCounts[key]++;
//       }
//     }
//   });
  
//   const labels = Object.keys(monthlyCounts);
//   const data = Object.values(monthlyCounts);
  
//   return {
//     labels,
//     data
//   };
// }

// // ==================== OPTIMIZED LOADER FUNCTION (Using orders page strategy) ====================
// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   try {
//     const { admin, session } = await authenticate.admin(request);
//     const shop = session.shop;

//     // ==================== FETCH PRODUCTS WITH PAGINATION (Orders page strategy) ====================
//     let allProducts: any[] = [];
//     let hasNextPage = true;
//     let endCursor: string | null = null;

//     while (hasNextPage && allProducts.length < 1000) {
//       const productsQuery = `
//         {
//           products(
//             first: 250, 
//             ${endCursor ? `after: "${endCursor}",` : ''}
//             sortKey: CREATED_AT, 
//             reverse: true
//           ) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 status
//                 createdAt
//                 description
//                 featuredImage {
//                   url
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const productsResponse = await admin.graphql(productsQuery);
//       const productsData = await productsResponse.json() as any;
      
//       if (productsData.errors) {
//         throw new Error(productsData.errors[0]?.message || "Failed to fetch products");
//       }
      
//       const productsPage = productsData.data?.products?.edges || [];
//       allProducts = [...allProducts, ...productsPage];
      
//       hasNextPage = productsData.data?.products?.pageInfo?.hasNextPage || false;
//       endCursor = productsData.data?.products?.pageInfo?.endCursor;
      
//       if (!hasNextPage || allProducts.length >= 1000) break;
//     }

//     // ==================== FETCH COLLECTIONS WITH PAGINATION ====================
//     let allCollections: any[] = [];
//     let hasMoreCollections = true;
//     let collectionsEndCursor: string | null = null;

//     while (hasMoreCollections && allCollections.length < 500) {
//       const collectionsQuery = `
//         {
//           collections(
//             first: 250, 
//             ${collectionsEndCursor ? `after: "${collectionsEndCursor}",` : ''}
//             sortKey: TITLE
//           ) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 id
//                 title
//                 description
//               }
//             }
//           }
//         }
//       `;

//       const collectionsResponse = await admin.graphql(collectionsQuery);
//       const collectionsData = await collectionsResponse.json() as any;
      
//       const collectionsPage = collectionsData.data?.collections?.edges || [];
//       allCollections = [...allCollections, ...collectionsPage];
      
//       hasMoreCollections = collectionsData.data?.collections?.pageInfo?.hasNextPage || false;
//       collectionsEndCursor = collectionsData.data?.collections?.pageInfo?.endCursor;
      
//       if (!hasMoreCollections || allCollections.length >= 500) break;
//     }

//     // ==================== RETURN EMPTY DATA IF NO PRODUCTS ====================
//     if (allProducts.length === 0) {
//       return json(getEmptyData(shop));
//     }

//     // ==================== PROCESS DATA ====================
//     const processedData = await processProductsData(admin, allProducts, allCollections, shop);
//     return json(processedData);
    
//   } catch (error: any) {
//     console.error("Error in products loader:", error);
//     return json(getEmptyData(""));
//   }
// };

// // Process products data function
// async function processProductsData(admin: any, allProducts: any[], allCollections: any[], shop: string) {
//   // ==================== PARALLEL METRICS CALCULATION ====================
//   const [
//     inventoryMetrics,
//     statusBreakdown,
//     productTimeline,
//     seoInsights
//   ] = await Promise.all([
//     getInventoryMetrics(admin, allProducts),
//     getProductStatusBreakdown(allProducts),
//     getProductTimeline(allProducts),
//     getSEOInsights(allProducts)
//   ]);

//   // ==================== PARALLEL COLLECTION COUNTS ====================
//   const collectionsWithCounts = await Promise.all(
//     allCollections.map(async (collection: any) => {
//       try {
//         const productCount = await fetchAllCollectionProducts(admin, collection.node.id);
//         return {
//           ...collection,
//           productCount: productCount
//         };
//       } catch (error) {
//         console.error(`Error fetching products for collection ${collection.node.title}:`, error);
//         return {
//           ...collection,
//           productCount: 0
//         };
//       }
//     })
//   );

//   // ==================== YOUR ORIGINAL CALCULATIONS ====================
//   const totalProducts = allProducts.length;
//   const activeProducts = allProducts.filter((p: any) => p.node.status === "ACTIVE").length;

//   const startOfMonth = new Date();
//   startOfMonth.setDate(1);
//   startOfMonth.setHours(0, 0, 0, 0);
//   const newProductsThisMonth = allProducts.filter((p: any) => new Date(p.node.createdAt) >= startOfMonth).length;

//   const collectionStats = {
//     totalCollections: collectionsWithCounts.length,
//     collectionsWithProducts: collectionsWithCounts.filter((c: any) => (c.productCount || 0) > 0).length,
//     emptyCollections: collectionsWithCounts.filter((c: any) => (c.productCount || 0) === 0).length,
//     averageProductsPerCollection: collectionsWithCounts.length > 0
//       ? collectionsWithCounts.reduce((sum: number, c: any) => sum + (c.productCount || 0), 0) / collectionsWithCounts.length
//       : 0,
//     largestCollection: collectionsWithCounts.length > 0
//       ? collectionsWithCounts.reduce((max: any, c: any) => (c.productCount || 0) > (max.productCount || 0) ? c : max, collectionsWithCounts[0])
//       : null,
//   };

//   // Calculate optimization score with complete data
//   const optimizationScore = calculateOptimizationScore(
//     { totalProducts, activeProducts, newProductsThisMonth, collectionStats },
//     inventoryMetrics,
//     seoInsights,
//     statusBreakdown
//   );

//   // Generate chart data with REAL percentages from complete data
//   const chartData = generateChartData(allProducts, collectionsWithCounts, statusBreakdown);

//   return {
//     totalProducts,
//     activeProducts,
//     newProductsThisMonth,
//     totalCollections: collectionsWithCounts.length,
//     collectionsWithCounts,
//     collectionStats,
//     allProductsCount: allProducts.length,
//     enhancedMetrics: {
//       inventory: inventoryMetrics,
//       statusBreakdown,
//       productTimeline,
//       seoInsights,
//       optimizationScore,
//     },
//     insights: {
//       needsAttention: inventoryMetrics.lowStock + inventoryMetrics.outOfStock + seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
//       growthOpportunity: productTimeline.last30Days,
//       seoImprovements: seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
//     },
//     shop: shop,
//     chartData: chartData,
//     productsLoaded: allProducts.length
//   };
// }

// function getEmptyData(shop: string) {
//   return {
//     totalProducts: 0,
//     activeProducts: 0,
//     newProductsThisMonth: 0,
//     totalCollections: 0,
//     collectionsWithCounts: [],
//     collectionStats: {
//       totalCollections: 0,
//       collectionsWithProducts: 0,
//       emptyCollections: 0,
//       averageProductsPerCollection: 0,
//       largestCollection: null
//     },
//     allProductsCount: 0,
//     enhancedMetrics: {
//       inventory: { 
//         totalVariants: 0, 
//         outOfStock: 0, 
//         lowStock: 0, 
//         inventoryValue: 0,
//         outOfStockProducts: [],
//         lowStockProducts: []
//       },
//       statusBreakdown: { draft: 0, active: 0, archived: 0 },
//       productTimeline: { last30Days: 0, last90Days: 0, thisYear: 0 },
//       seoInsights: { 
//         missingMeta: 0, 
//         shortTitles: 0, 
//         missingImages: 0,
//         seoScore: 0,
//         missingMetaProducts: [],
//         shortTitleProducts: [],
//         missingImageProducts: []
//       },
//       optimizationScore: 0,
//     },
//     insights: {
//       needsAttention: 0,
//       growthOpportunity: 0,
//       seoImprovements: 0,
//     },
//     shop: shop,
//     chartData: {
//       statusData: { activePercentage: 0, draftPercentage: 0, archivedPercentage: 0 },
//       topCollections: [],
//       monthlyData: { labels: [], data: [] }
//     },
//     productsLoaded: 0
//   };
// }

// // ==================== ICON COMPONENTS ====================
// const Icon = {
//   Print: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
//     </svg>
//   ),
//   Manage: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
//     </svg>
//   ),
//   Attention: () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
//     </svg>
//   )
// };

// // ==================== COMPONENT ====================
// export default function Products() {
//   const data = useLoaderData<typeof loader>();
//   const navigation = useNavigation();
//   const [isExporting, setIsExporting] = useState(false);

//   const isLoading = navigation.state === 'loading';

//   // ==================== YOUR ORIGINAL FORMATTING FUNCTIONS ====================
//   const formatNumber = (num: number | null | undefined) => {
//     if (num === null || num === undefined || isNaN(num)) return '0';
//     return num.toLocaleString();
//   };

//   const formatPercentage = (num: number | null | undefined) => {
//     if (num === null || num === undefined || isNaN(num)) return '0.0';
//     return num.toFixed(1);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   // Tooltip Component
//   const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
//     <span className="tooltip" data-tooltip={text}>
//       {children}
//     </span>
//   );

//   // Trend Indicator Component
//   const TrendIndicator = ({ value, previousValue }: { value: number; previousValue: number }) => {
//     const trend = value - previousValue;
//     const trendPercent = previousValue > 0 ? (trend / previousValue) * 100 : 0;
    
//     return (
//       <div className={`trend-indicator ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
//         {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
//         {Math.abs(trendPercent).toFixed(1)}%
//       </div>
//     );
//   };

//   // Quality Badge Component
//   const QualityBadge = ({ score }: { score: number }) => {
//     let qualityClass = '';
//     let label = '';
    
//     if (score >= 90) {
//       qualityClass = 'quality-excellent';
//       label = 'Excellent';
//     } else if (score >= 75) {
//       qualityClass = 'quality-good';
//       label = 'Good';
//     } else if (score >= 60) {
//       qualityClass = 'quality-fair';
//       label = 'Fair';
//     } else {
//       qualityClass = 'quality-poor';
//       label = 'Needs Work';
//     }
    
//     return (
//       <span className={`quality-badge ${qualityClass}`}>
//         {label}
//       </span>
//     );
//   };






//    // Calculate real percentages for pie chart from ALL products
//   const activePercentage = data.enhancedMetrics.statusBreakdown.active;
//   const draftPercentage = data.enhancedMetrics.statusBreakdown.draft;
//   const archivedPercentage = data.enhancedMetrics.statusBreakdown.archived;
//   const totalStatus = activePercentage + draftPercentage + archivedPercentage;

//   return (
//     <div className="products-dashboard">
//       {/* Dashboard Header */}
//       <div className="dashboard-header">
//         <h1>Products Dashboard</h1>
//         <div className="header-controls">
//           <a 
//             href={`https://${data.shop}/admin/products`} 
//             className="action-button"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Icon.Manage />
//             Manage Products
//           </a>
//       <button 
//   className="print-report-btn"
//   onClick={() => {
//     console.log('🖨️ NEW PRINT BUTTON CLICKED');
//     window.print();
//   }}
//   style={{
//     background: '#2563eb',
//     color: 'white',
//     border: 'none',
//     padding: '10px 16px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '600',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'all 0.2s ease'
//   }}
// >
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
//   </svg>
//   Print Report
// </button>
//         </div>
//       </div>

//       {/* Optimization Score with Clickable Needs Attention */}
//       <div className="optimization-score">
//         <div className="score-card">
//           <div className="score-value">{data.enhancedMetrics.optimizationScore}</div>
//           <div className="score-label">Optimization Score</div>
//           <div className="score-description">Based on analysis of {formatNumber(data.totalProducts)} products</div>
//         </div>
//         <div className="insights-pills">
//   <Link 
//     to="/attention"
//     className={`insight-pill clickable ${data.insights.needsAttention > 0 ? 'warning' : 'success'}`}
//   >
//     <Icon.Attention />
//     {data.insights.needsAttention} need attention
//   </Link>
//   <div className="insight-pill info non-clickable">
//     {data.insights.growthOpportunity} new this month
//   </div>
//   <div className="insight-pill info non-clickable">
//     {data.insights.seoImprovements} SEO improvements
//   </div>
// </div>
//       </div>






   












//           {/* Products Overview Section */}
//       <div className="products-overview">
//         <h2>📦 Products Overview</h2>
//         <div className="primary-metrics-grid">
//           <div className="metric-card total-products">
//             <div className="metric-value">{formatNumber(data.totalProducts)}</div>
//             <div className="metric-label">Total Products</div>
//             <div className="metric-description">Complete catalog analysis</div>
//           </div>
          
//           <div className="metric-card active-products">
//             <div className="metric-value">{formatNumber(data.activeProducts)}</div>
//             <div className="metric-label">Active Products</div>
//             <div className="metric-description">
//               {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}% of total
//             </div>
//           </div>
          
//           <div className="metric-card new-products">
//             <div className="metric-value">{formatNumber(data.newProductsThisMonth)}</div>
//             <div className="metric-label">New This Month</div>
//             <div className="metric-description">Recent product additions</div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//             {/* Charts Section */}
//       <div className="charts-section">
//         <h2>📊 Visual Analytics</h2>
//         <div className="charts-grid">
//           {/* Product Status Distribution */}
//           <div className="chart-container">
//             <h3>Product Status Distribution</h3>
//             <div className="chart-placeholder pie-chart">
//               <div className="chart-visual">
//                 <div 
//                   className="pie-chart-visual"
//                   style={{
//                     background: `conic-gradient(
//                       #28a745 0% ${data.chartData.statusData.activePercentage}%,
//                       #ffc107 ${data.chartData.statusData.activePercentage}% ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}%,
//                       #dc3545 ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}% 100%
//                     )`
//                   }}
//                 >
//                   <div className="pie-center">
//                     <div className="pie-total">{formatNumber(totalStatus)}</div>
//                     <div className="pie-label">Products</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="chart-legend">
//                 <div className="legend-item tooltip" data-tooltip={`${formatNumber(activePercentage)} active products (${formatPercentage(data.chartData.statusData.activePercentage)}% of total)`}>
//                   <span className="legend-color active"></span>
//                   <span>Active: {formatNumber(activePercentage)} ({formatPercentage(data.chartData.statusData.activePercentage)}%)</span>
//                 </div>
//                 <div className="legend-item tooltip" data-tooltip={`${formatNumber(draftPercentage)} draft products (${formatPercentage(data.chartData.statusData.draftPercentage)}% of total)`}>
//                   <span className="legend-color draft"></span>
//                   <span>Draft: {formatNumber(draftPercentage)} ({formatPercentage(data.chartData.statusData.draftPercentage)}%)</span>
//                 </div>
//                 <div className="legend-item tooltip" data-tooltip={`${formatNumber(archivedPercentage)} archived products (${formatPercentage(data.chartData.statusData.archivedPercentage)}% of total)`}>
//                   <span className="legend-color archived"></span>
//                   <span>Archived: {formatNumber(archivedPercentage)} ({formatPercentage(data.chartData.statusData.archivedPercentage)}%)</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Top Collections */}
//                 {/* Top Collections */}
//           <div className="chart-container">
//             <h3>Top Collections</h3>
//             <div className="chart-placeholder bar-chart">
//               <div className="chart-visual">
//                 <div className="bar-chart-visual">
//                   {data.chartData.topCollections.slice(0, 5).map((collection: any, index: number) => {
//                     const maxCount = Math.max(...data.chartData.topCollections.map((c: any) => c.productCount));
//                     // Ensure minimum height for visibility, even for small numbers
//                     const heightPercentage = maxCount > 0 ? 
//                       Math.max(10, (collection.productCount / maxCount) * 100) : 10;
//                     return (
//                       <div key={collection.node.id} className="bar-container tooltip" data-tooltip={`${collection.node.title}: ${collection.productCount} products`}>
//                         <div 
//                           className="bar" 
//                           style={{ height: `${heightPercentage}%` }}
//                         ></div>
//                         <div className="bar-label">{collection.node.title.split(' ')[0]}</div>
//                         <div className="bar-value">{collection.productCount}</div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div className="chart-summary tooltip" data-tooltip={`Largest collection: ${data.collectionStats.largestCollection?.node.title || 'None'} with ${data.collectionStats.largestCollection?.productCount || 0} products`}>
//                 Total collections: {formatNumber(data.totalCollections)}
//               </div>
//             </div>
//           </div>

//           {/* Monthly Product Growth */}



          
//                     {/* Monthly Product Growth */}
//           <div className="chart-container">
//             <h3>Monthly Product Growth</h3>
//             <div className="chart-placeholder line-chart">
//               <div className="chart-visual">
//                 <div className="line-chart-visual">
//                   <div className="line-graph">
//                     {/* Connect the dots with a line */}
//                     <svg className="line-path" viewBox="0 0 100 100" preserveAspectRatio="none">
//                       <path 
//                         className="line" 
//                         d={data.chartData.monthlyData.labels.map((label: string, index: number) => {
//                           const maxData = Math.max(...data.chartData.monthlyData.data);
//                           const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
//                           const x = (index / (data.chartData.monthlyData.labels.length - 1)) * 100;
//                           const y = 100 - heightPercentage;
//                           return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
//                         }).join(' ')}
//                         fill="none"
//                         stroke="#6f42c1"
//                         strokeWidth="2"
//                       />
//                     </svg>
                    
//                     {/* Data points */}
//                     {data.chartData.monthlyData.labels.map((label: string, index: number) => {
//                       const maxData = Math.max(...data.chartData.monthlyData.data);
//                       const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
//                       const value = data.chartData.monthlyData.data[index];
//                       return (
//                         <div 
//                           key={label} 
//                           className="data-point tooltip" 
//                           data-tooltip={`${label}: ${value} new products`}
//                           style={{ 
//                             left: `${(index / (data.chartData.monthlyData.labels.length - 1)) * 100}%`,
//                             bottom: `${heightPercentage}%`
//                           }}
//                         ></div>
//                       );
//                     })}
//                   </div>
//                   <div className="x-axis">
//                     {data.chartData.monthlyData.labels.map((label: string) => (
//                       <div key={label} className="x-label">{label}</div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="chart-summary tooltip" data-tooltip={`${data.enhancedMetrics.productTimeline.last30Days} products created in the last 30 days`}>
//                 Recent growth: {formatNumber(data.enhancedMetrics.productTimeline.last30Days)} products
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>







//       {/* Inventory Management Section */}
//          {/* Inventory Management Section */}
//       <div className="inventory-section">
//         <h2>📊 Inventory Overview</h2>
//         <div className="inventory-grid">
//           <div className="inventory-card total-variants">
//             <Tooltip text="Total number of product variants across all products">
//               <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.totalVariants)}</div>
//             </Tooltip>
//             <div className="inventory-label">Total Variants</div>
//             <div className="inventory-status">
//               <div className="status-dot healthy"></div>
//               <span>All variants tracked</span>
//             </div>
//           </div>
//           <div className="inventory-card out-of-stock">
//             <Tooltip text="Variants currently out of stock that need restocking">
//               <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.outOfStock)}</div>
//             </Tooltip>
//             <div className="inventory-label">Out of Stock</div>
//             <div className="inventory-status">
//               <div className={`status-dot ${data.enhancedMetrics.inventory.outOfStock > 0 ? 'critical' : 'healthy'}`}></div>
//               <span>{data.enhancedMetrics.inventory.outOfStock > 0 ? 'Needs attention' : 'All in stock'}</span>
//             </div>
//           </div>
//           <div className="inventory-card low-stock">
//             <Tooltip text="Variants with 5 or fewer items in stock">
//               <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.lowStock)}</div>
//             </Tooltip>
//             <div className="inventory-label">Low Stock</div>
//             <div className="inventory-status">
//               <div className={`status-dot ${data.enhancedMetrics.inventory.lowStock > 0 ? 'warning' : 'healthy'}`}></div>
//               <span>{data.enhancedMetrics.inventory.lowStock > 0 ? 'Monitor closely' : 'Good levels'}</span>
//             </div>
//           </div>
//           <div className="inventory-card inventory-value">
//             <Tooltip text="Total value of all inventory at current prices">
//               <div className="inventory-value">{formatCurrency(data.enhancedMetrics.inventory.inventoryValue)}</div>
//             </Tooltip>
//             <div className="inventory-label">Inventory Value</div>
//             <div className="inventory-status">
//               <div className="status-dot healthy"></div>
//               <span>Total asset value</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Status & Timeline */}
//       <div className="status-timeline-section">
//         <div className="status-breakdown">
//           <h3>📈 Product Status</h3>
//           <div className="status-grid">
//             <div className="status-card active">
//               <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.active)}</div>
//               <div className="status-label">Active</div>
//             </div>
//             <div className="status-card draft">
//               <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.draft)}</div>
//               <div className="status-label">Draft</div>
//             </div>
//             <div className="status-card archived">
//               <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.archived)}</div>
//               <div className="status-label">Archived</div>
//             </div>
//           </div>
//         </div>

//         <div className="timeline-breakdown">
//           <h3>🕒 Product Timeline</h3>
//           <div className="timeline-grid">
//             <div className="timeline-card">
//               <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last30Days)}</div>
//               <div className="timeline-label">Last 30 Days</div>
//             </div>
//             <div className="timeline-card">
//               <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last90Days)}</div>
//               <div className="timeline-label">Last 90 Days</div>
//             </div>
//             <div className="timeline-card">
//               <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.thisYear)}</div>
//               <div className="timeline-label">This Year</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SEO Insights */}
//             {/* SEO Insights */}
//       <div className="seo-section">
//         <h2>🔍 SEO Insights</h2>
//         <div className="seo-grid">
//           <div className="seo-card">
//             <Tooltip text={`${data.enhancedMetrics.seoInsights.missingMeta} products have short or missing descriptions that affect SEO`}>
//               <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingMeta)}</div>
//             </Tooltip>
//             <div className="seo-label">Missing Descriptions</div>
//             <div className="seo-description">Products needing better descriptions</div>
//             <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingMeta / data.totalProducts) * 100} />
//           </div>
//           <div className="seo-card">
//             <Tooltip text={`${data.enhancedMetrics.seoInsights.shortTitles} products have titles shorter than 10 characters`}>
//               <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.shortTitles)}</div>
//             </Tooltip>
//             <div className="seo-label">Short Titles</div>
//             <div className="seo-description">Titles under 10 characters</div>
//             <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.shortTitles / data.totalProducts) * 100} />
//           </div>
//           <div className="seo-card">
//             <Tooltip text={`${data.enhancedMetrics.seoInsights.missingImages} products are missing featured images`}>
//               <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingImages)}</div>
//             </Tooltip>
//             <div className="seo-label">Missing Images</div>
//             <div className="seo-description">Products without featured images</div>
//             <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingImages / data.totalProducts) * 100} />
//           </div>
//           <div className="seo-card score">
//             <Tooltip text="Overall SEO health score based on descriptions, titles, and images">
//               <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.seoScore)}%</div>
//             </Tooltip>
//             <div className="seo-label">SEO Score</div>
//             <div className="seo-description">Overall SEO health</div>
//             <QualityBadge score={data.enhancedMetrics.seoInsights.seoScore} />
//           </div>
//         </div>
//       </div>

//       {/* Collections Overview Section */}
//       <div className="collections-overview">
//         <h2>📚 Collections Analytics</h2>
        
//         <div className="collections-stats-grid">
//           <div className="collection-stat-card">
//             <div className="collection-stat-value">{formatNumber(data.collectionStats.totalCollections)}</div>
//             <div className="collection-stat-label">Total Collections</div>
//           </div>
          
//           <div className="collection-stat-card">
//             <div className="collection-stat-value">{formatNumber(data.collectionStats.collectionsWithProducts)}</div>
//             <div className="collection-stat-label">With Products</div>
//           </div>
          
//           <div className="collection-stat-card">
//             <div className="collection-stat-value">{formatNumber(data.collectionStats.emptyCollections)}</div>
//             <div className="collection-stat-label">Empty Collections</div>
//           </div>
          
//           <div className="collection-stat-card">
//             <div className="collection-stat-value">{formatPercentage(data.collectionStats.averageProductsPerCollection)}</div>
//             <div className="collection-stat-label">Avg Products</div>
//           </div>
//         </div>

//         {/* Largest Collection Highlight */}
//         {data.collectionStats.largestCollection && data.collectionStats.largestCollection.productCount > 0 && (
//           <div className="largest-collection">
//             <h3>🏆 Largest Collection</h3>
//             <div className="collection-name">
//               {data.collectionStats.largestCollection.node.title}
//             </div>
//             <div className="product-count">
//               {formatNumber(data.collectionStats.largestCollection.productCount)} products
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Performance Insights */}
//       <div className="performance-insights">
//         <h2>📊 Performance Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-item">
//             <div className="insight-value">
//               {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}%
//             </div>
//             <div className="insight-label">Active Rate</div>
//           </div>
          
//           <div className="insight-item">
//             <div className="insight-value">
//               {data.totalCollections > 0 ? formatPercentage((data.collectionStats.collectionsWithProducts / data.totalCollections) * 100) : '0'}%
//             </div>
//             <div className="insight-label">Utilized Collections</div>
//           </div>
          
//           <div className="insight-item">
//             <div className="insight-value">
//               {data.totalCollections > 0 ? formatPercentage((data.collectionStats.emptyCollections / data.totalCollections) * 100) : '0'}%
//             </div>
//             <div className="insight-label">Empty Collections</div>
//           </div>
//         </div>
//       </div>

//       {/* Collections Breakdown */}
//       <div className="collections-breakdown">
//         <h2>🗂️ Collections Breakdown</h2>
        
//         {data.collectionsWithCounts.length > 0 ? (
//           <div className="collections-grid">
//             {data.collectionsWithCounts.map((collection: any) => (
//               <div key={collection.node.id} className="collection-card">
//                 <div className="collection-header">
//                   <div className="collection-title">{collection.node.title}</div>
//                   {collection.node.description && (
//                     <div className="collection-description">
//                       {collection.node.description}
//                     </div>
//                   )}
//                 </div>
//                 <div className="collection-stats">
//                   <div className="product-count-badge">
//                     {formatNumber(collection.productCount)} products
//                   </div>
//                   <div className={`collection-status ${collection.productCount > 0 ? 'status-active' : 'status-draft'}`}>
//                     {collection.productCount > 0 ? 'Active' : 'Empty'}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-collections">
//             <h3>No Collections Found</h3>
//             <p>Create collections to organize your products and improve customer experience.</p>
//           </div>
//         )}
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2>⚡ Quick Actions</h2>
//         <div className="actions-grid">
//           <a 
//             href={`https://${data.shop}/admin/products/new`} 
//             className="action-card" 
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <div className="action-icon">➕</div>
//             <div className="action-title">Add New Product</div>
//             <div className="action-description">Create a new product</div>
//           </a>
//           <a 
//             href={`https://${data.shop}/admin/collections`} 
//             className="action-card" 
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <div className="action-icon">📁</div>
//             <div className="action-title">Manage Collections</div>
//             <div className="action-description">Organize your products</div>
//           </a>
//           <a 
//             href={`https://${data.shop}/admin/products/inventory`} 
//             className="action-card" 
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <div className="action-icon">📦</div>
//             <div className="action-title">Inventory Management</div>
//             <div className="action-description">Update stock levels</div>
//           </a>
//           <div className="action-card" onClick={() => window.print()}>
//             <div className="action-icon">📊</div>
//             <div className="action-title">Export Report</div>
//             <div className="action-description">Print or save as PDF</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ==================== 1. IMPORTS ====================
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "../styles/products.css";
import { useState } from 'react';

// ==================== 2. LOADING COMPONENT ====================
function LoadingProgress() {
  const loadingSteps = [
    "Scanning products...",
    "Analyzing inventory...", 
    "Checking SEO...",
    "Processing collections...",
    "Generating analytics..."
  ];

  return (
    <div className="loading-progress-container">
      <div className="loading-header">
        <h2>Preparing Your Products Dashboard</h2>
        <p>This may take 20-30 seconds as we analyze your entire product catalog</p>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="loading-step">
            <div className="step-indicator">⟳</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 3. TYPES ====================
interface ProductsData {
  totalProducts: number;
  activeProducts: number;
  newProductsThisMonth: number;
  totalCollections: number;
  collectionsWithCounts: any[];
  collectionStats: {
    totalCollections: number;
    collectionsWithProducts: number;
    emptyCollections: number;
    averageProductsPerCollection: number;
    largestCollection: any;
  };
  enhancedMetrics: {
    inventory: { 
      totalVariants: number; 
      outOfStock: number; 
      lowStock: number; 
      inventoryValue: number;
      outOfStockProducts: any[];
      lowStockProducts: any[];
    };
    statusBreakdown: { draft: number; active: number; archived: number };
    productTimeline: { last30Days: number; last90Days: number; thisYear: number };
    seoInsights: { 
      missingMeta: number; 
      shortTitles: number; 
      missingImages: number;
      seoScore: number;
      missingMetaProducts: any[];
      shortTitleProducts: any[];
      missingImageProducts: any[];
    };
    optimizationScore: number;
  };
  insights: {
    needsAttention: number;
    growthOpportunity: number;
    seoImprovements: number;
  };
  shop: string;
  chartData: {
    statusData: { activePercentage: number; draftPercentage: number; archivedPercentage: number };
    topCollections: any[];
    monthlyData: { labels: string[]; data: number[] };
  };
  productsLoaded: number;
}

// ==================== 4. HELPER FUNCTIONS ====================
async function fetchAllCollectionProducts(admin: any, collectionId: string) {
  let allProducts: any[] = [];
  let after = null;
  let hasMore = true;

  while (hasMore) {
    const productsQuery = after 
      ? `products(first: 250, after: "${after}")`
      : `products(first: 250)`;

    const response = await admin.graphql(`
      query collectionProducts($id: ID!) {
        collection(id: $id) {
          ${productsQuery} {
            edges {
              node {
                id
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `, {
      variables: { id: collectionId }
    });

    const data = await response.json() as any;
    const products = data.data?.collection?.products?.edges || [];
    const pageInfo = data.data?.collection?.products?.pageInfo;

    allProducts = [...allProducts, ...products];
    after = pageInfo?.endCursor;
    hasMore = pageInfo?.hasNextPage;

    if (allProducts.length >= 1000) break;
  }

  return allProducts.length;
}

async function getInventoryMetrics(admin: any, allProducts: any[]) {
  let totalVariants = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let totalInventoryValue = 0;
  
  const outOfStockProducts: any[] = [];
  const lowStockProducts: any[] = [];
  
  const sampleProducts = allProducts.slice(0, 50);
  
  for (const product of sampleProducts) {
    try {
      const variantsResponse = await admin.graphql(`
        query productVariants($id: ID!) {
          product(id: $id) {
            title
            handle
            variants(first: 10) {
              edges {
                node {
                  inventoryQuantity
                  price
                  sku
                  title
                }
              }
            }
          }
        }
      `, {
        variables: { id: product.node.id }
      });
      
      const variantsData = await variantsResponse.json() as any;
      const variants = variantsData.data?.product?.variants?.edges || [];
      
      let productOutOfStock = false;
      let productLowStock = false;
      
      variants.forEach((variant: any) => {
        totalVariants++;
        const quantity = variant.node.inventoryQuantity || 0;
        const price = parseFloat(variant.node.price) || 0;
        
        if (quantity === 0) {
          outOfStockCount++;
          productOutOfStock = true;
        }
        if (quantity > 0 && quantity <= 5) {
          lowStockCount++;
          productLowStock = true;
        }
        totalInventoryValue += quantity * price;
      });

      if (productOutOfStock) {
        outOfStockProducts.push({
          title: variantsData.data?.product?.title,
          handle: variantsData.data?.product?.handle,
          type: 'out_of_stock'
        });
      } else if (productLowStock) {
        lowStockProducts.push({
          title: variantsData.data?.product?.title,
          handle: variantsData.data?.product?.handle,
          type: 'low_stock'
        });
      }
      
    } catch (error) {
      continue;
    }
  }
  
  const sampleRatio = sampleProducts.length / Math.max(allProducts.length, 1);
  
  return {
    totalVariants: Math.round(totalVariants / Math.max(sampleRatio, 0.1)),
    outOfStock: Math.round(outOfStockCount / Math.max(sampleRatio, 0.1)),
    lowStock: Math.round(lowStockCount / Math.max(sampleRatio, 0.1)),
    inventoryValue: Math.round(totalInventoryValue / Math.max(sampleRatio, 0.1)),
    outOfStockProducts: outOfStockProducts.slice(0, 10),
    lowStockProducts: lowStockProducts.slice(0, 10),
  };
}

function getProductStatusBreakdown(allProducts: any[]) {
  const statusCounts = {
    draft: 0,
    active: 0,
    archived: 0,
  };
  
  allProducts.forEach((product: any) => {
    switch (product.node.status) {
      case 'DRAFT': statusCounts.draft++; break;
      case 'ACTIVE': statusCounts.active++; break;
      case 'ARCHIVED': statusCounts.archived++; break;
    }
  });
  
  return statusCounts;
}

function getProductTimeline(allProducts: any[]) {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const last90Days = new Date();
  last90Days.setDate(last90Days.getDate() - 90);
  
  return {
    last30Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last30Days).length,
    last90Days: allProducts.filter((p: any) => new Date(p.node.createdAt) >= last90Days).length,
    thisYear: allProducts.filter((p: any) => new Date(p.node.createdAt).getFullYear() === new Date().getFullYear()).length,
  };
}

function getSEOInsights(allProducts: any[]) {
  const productsWithMissingMeta = allProducts.filter((p: any) => 
    !p.node.description || p.node.description.trim().length < 50
  );
  
  const productsWithShortTitles = allProducts.filter((p: any) => 
    !p.node.title || p.node.title.length < 10
  );

  const productsWithMissingImages = allProducts.filter((p: any) => 
    !p.node.featuredImage?.url
  );
  
  return {
    missingMeta: productsWithMissingMeta.length,
    shortTitles: productsWithShortTitles.length,
    missingImages: productsWithMissingImages.length,
    seoScore: Math.max(0, 100 - (productsWithMissingMeta.length / Math.max(allProducts.length, 1) * 100)),
    missingMetaProducts: productsWithMissingMeta.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    })),
    shortTitleProducts: productsWithShortTitles.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    })),
    missingImageProducts: productsWithMissingImages.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id
    }))
  };
}

function calculateOptimizationScore(mainData: any, inventory: any, seoInsights: any, statusBreakdown: any) {
  let score = 0;
  
  const activeRate = mainData.totalProducts > 0 ? (mainData.activeProducts / mainData.totalProducts) * 100 : 0;
  score += (activeRate / 100) * 30;
  
  const collectionUtilization = mainData.totalCollections > 0 ? 
    (mainData.collectionStats.collectionsWithProducts / mainData.totalCollections) * 100 : 0;
  score += (collectionUtilization / 100) * 20;
  
  const inventoryHealth = inventory.totalVariants > 0 ? 
    (1 - (inventory.outOfStock / inventory.totalVariants)) * 100 : 100;
  score += (inventoryHealth / 100) * 30;
  
  const recentProducts = mainData.newProductsThisMonth;
  const recentScore = Math.min(20, (recentProducts / 10) * 20);
  score += recentScore;
  
  return Math.round(Math.min(100, score));
}

function generateChartData(allProducts: any[], collectionsWithCounts: any[], statusBreakdown: any) {
  const total = statusBreakdown.active + statusBreakdown.draft + statusBreakdown.archived;
  const activePercentage = total > 0 ? (statusBreakdown.active / total) * 100 : 0;
  const draftPercentage = total > 0 ? (statusBreakdown.draft / total) * 100 : 0;
  const archivedPercentage = total > 0 ? (statusBreakdown.archived / total) * 100 : 0;

  const topCollections = [...collectionsWithCounts]
    .sort((a: any, b: any) => b.productCount - a.productCount)
    .slice(0, 8);
  
  const monthlyData = generateMonthlyProductData(allProducts);

  return {
    statusData: {
      activePercentage,
      draftPercentage,
      archivedPercentage
    },
    topCollections,
    monthlyData
  };
}

function generateMonthlyProductData(allProducts: any[]) {
  const monthlyCounts: { [key: string]: number } = {};
  const currentYear = new Date().getFullYear();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthlyCounts[key] = 0;
  }
  
  allProducts.forEach((product: any) => {
    const productDate = new Date(product.node.createdAt);
    if (productDate.getFullYear() === currentYear) {
      const key = productDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyCounts[key] !== undefined) {
        monthlyCounts[key]++;
      }
    }
  });
  
  const labels = Object.keys(monthlyCounts);
  const data = Object.values(monthlyCounts);
  
  return {
    labels,
    data
  };
}

// ==================== 5. LOADER FUNCTION ====================
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shop = session.shop;

    let allProducts: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage && allProducts.length < 1000) {
      const productsQuery = `
        {
          products(
            first: 250, 
            ${endCursor ? `after: "${endCursor}",` : ''}
            sortKey: CREATED_AT, 
            reverse: true
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                status
                createdAt
                description
                featuredImage {
                  url
                }
              }
            }
          }
        }
      `;

      const productsResponse = await admin.graphql(productsQuery);
      const productsData = await productsResponse.json() as any;
      
      if (productsData.errors) {
        throw new Error(productsData.errors[0]?.message || "Failed to fetch products");
      }
      
      const productsPage = productsData.data?.products?.edges || [];
      allProducts = [...allProducts, ...productsPage];
      
      hasNextPage = productsData.data?.products?.pageInfo?.hasNextPage || false;
      endCursor = productsData.data?.products?.pageInfo?.endCursor;
      
      if (!hasNextPage || allProducts.length >= 1000) break;
    }

    let allCollections: any[] = [];
    let hasMoreCollections = true;
    let collectionsEndCursor: string | null = null;

    while (hasMoreCollections && allCollections.length < 500) {
      const collectionsQuery = `
        {
          collections(
            first: 250, 
            ${collectionsEndCursor ? `after: "${collectionsEndCursor}",` : ''}
            sortKey: TITLE
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                description
              }
            }
          }
        }
      `;

      const collectionsResponse = await admin.graphql(collectionsQuery);
      const collectionsData = await collectionsResponse.json() as any;
      
      const collectionsPage = collectionsData.data?.collections?.edges || [];
      allCollections = [...allCollections, ...collectionsPage];
      
      hasMoreCollections = collectionsData.data?.collections?.pageInfo?.hasNextPage || false;
      collectionsEndCursor = collectionsData.data?.collections?.pageInfo?.endCursor;
      
      if (!hasMoreCollections || allCollections.length >= 500) break;
    }

    if (allProducts.length === 0) {
      return json(getEmptyData(shop));
    }

    const processedData = await processProductsData(admin, allProducts, allCollections, shop);
    return json(processedData);
    
  } catch (error: any) {
    return json(getEmptyData(""));
  }
};

async function processProductsData(admin: any, allProducts: any[], allCollections: any[], shop: string) {
  const [
    inventoryMetrics,
    statusBreakdown,
    productTimeline,
    seoInsights
  ] = await Promise.all([
    getInventoryMetrics(admin, allProducts),
    getProductStatusBreakdown(allProducts),
    getProductTimeline(allProducts),
    getSEOInsights(allProducts)
  ]);

  const collectionsWithCounts = await Promise.all(
    allCollections.map(async (collection: any) => {
      try {
        const productCount = await fetchAllCollectionProducts(admin, collection.node.id);
        return {
          ...collection,
          productCount: productCount
        };
      } catch (error) {
        return {
          ...collection,
          productCount: 0
        };
      }
    })
  );

  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter((p: any) => p.node.status === "ACTIVE").length;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newProductsThisMonth = allProducts.filter((p: any) => new Date(p.node.createdAt) >= startOfMonth).length;

  const collectionStats = {
    totalCollections: collectionsWithCounts.length,
    collectionsWithProducts: collectionsWithCounts.filter((c: any) => (c.productCount || 0) > 0).length,
    emptyCollections: collectionsWithCounts.filter((c: any) => (c.productCount || 0) === 0).length,
    averageProductsPerCollection: collectionsWithCounts.length > 0
      ? collectionsWithCounts.reduce((sum: number, c: any) => sum + (c.productCount || 0), 0) / collectionsWithCounts.length
      : 0,
    largestCollection: collectionsWithCounts.length > 0
      ? collectionsWithCounts.reduce((max: any, c: any) => (c.productCount || 0) > (max.productCount || 0) ? c : max, collectionsWithCounts[0])
      : null,
  };

  const optimizationScore = calculateOptimizationScore(
    { totalProducts, activeProducts, newProductsThisMonth, collectionStats },
    inventoryMetrics,
    seoInsights,
    statusBreakdown
  );

  const chartData = generateChartData(allProducts, collectionsWithCounts, statusBreakdown);

  return {
    totalProducts,
    activeProducts,
    newProductsThisMonth,
    totalCollections: collectionsWithCounts.length,
    collectionsWithCounts,
    collectionStats,
    allProductsCount: allProducts.length,
    enhancedMetrics: {
      inventory: inventoryMetrics,
      statusBreakdown,
      productTimeline,
      seoInsights,
      optimizationScore,
    },
    insights: {
      needsAttention: inventoryMetrics.lowStock + inventoryMetrics.outOfStock + seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
      growthOpportunity: productTimeline.last30Days,
      seoImprovements: seoInsights.missingMeta + seoInsights.shortTitles + seoInsights.missingImages,
    },
    shop: shop,
    chartData: chartData,
    productsLoaded: allProducts.length
  };
}

function getEmptyData(shop: string) {
  return {
    totalProducts: 0,
    activeProducts: 0,
    newProductsThisMonth: 0,
    totalCollections: 0,
    collectionsWithCounts: [],
    collectionStats: {
      totalCollections: 0,
      collectionsWithProducts: 0,
      emptyCollections: 0,
      averageProductsPerCollection: 0,
      largestCollection: null
    },
    allProductsCount: 0,
    enhancedMetrics: {
      inventory: { 
        totalVariants: 0, 
        outOfStock: 0, 
        lowStock: 0, 
        inventoryValue: 0,
        outOfStockProducts: [],
        lowStockProducts: []
      },
      statusBreakdown: { draft: 0, active: 0, archived: 0 },
      productTimeline: { last30Days: 0, last90Days: 0, thisYear: 0 },
      seoInsights: { 
        missingMeta: 0, 
        shortTitles: 0, 
        missingImages: 0,
        seoScore: 0,
        missingMetaProducts: [],
        shortTitleProducts: [],
        missingImageProducts: []
      },
      optimizationScore: 0,
    },
    insights: {
      needsAttention: 0,
      growthOpportunity: 0,
      seoImprovements: 0,
    },
    shop: shop,
    chartData: {
      statusData: { activePercentage: 0, draftPercentage: 0, archivedPercentage: 0 },
      topCollections: [],
      monthlyData: { labels: [], data: [] }
    },
    productsLoaded: 0
  };
}


// ==================== 6. ICON COMPONENTS ====================
const Icon = {
  Print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
  ),
  Manage: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  ),
  Attention: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
  Growth: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
    </svg>
  ),
  SEO: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Products: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  ),
  Inventory: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/>
    </svg>
  ),
  Status: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Timeline: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  Collections: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 6h-5v-2c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v15h20V6zm-7-2v2H9V4h6zm7 15H4v-2h16v2zm0-4H4V8h3v2h2V8h6v2h2V8h3v11z"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4c0 .74-.4 1.38-1 1.72v.78c0 .42.28.78.68.93C15.53 7.94 17 9.84 17 12v.5l-2 2V12c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4.5l-2-2V12c0-2.16 1.47-4.06 3.32-4.57.4-.15.68-.51.68-.93v-.78c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2zm-2 9c.55 0 1 .45 1 1v3.5l2 2V12c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v5.5l2-2V12c0-.55.45-1 1-1h2z"/>
    </svg>
  ),
  Insights: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  Folder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  ),
  Lightning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
  ),
  AddProduct: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  ManageCollections: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  Export: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
    </svg>
  )
};

// ==================== 7. MAIN COMPONENT ====================
export default function Products() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = navigation.state === 'loading';

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return '0.0';
    return num.toFixed(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <span className="tooltip" data-tooltip={text}>
      {children}
    </span>
  );

  const TrendIndicator = ({ value, previousValue }: { value: number; previousValue: number }) => {
    const trend = value - previousValue;
    const trendPercent = previousValue > 0 ? (trend / previousValue) * 100 : 0;
    
    return (
      <div className={`trend-indicator ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
        {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
        {Math.abs(trendPercent).toFixed(1)}%
      </div>
    );
  };

  const QualityBadge = ({ score }: { score: number }) => {
    let qualityClass = '';
    let label = '';
    
    if (score >= 90) {
      qualityClass = 'quality-excellent';
      label = 'Excellent';
    } else if (score >= 75) {
      qualityClass = 'quality-good';
      label = 'Good';
    } else if (score >= 60) {
      qualityClass = 'quality-fair';
      label = 'Fair';
    } else {
      qualityClass = 'quality-poor';
      label = 'Needs Work';
    }
    
    return (
      <span className={`quality-badge ${qualityClass}`}>
        {label}
      </span>
    );
  };

  const activePercentage = data.enhancedMetrics.statusBreakdown.active;
  const draftPercentage = data.enhancedMetrics.statusBreakdown.draft;
  const archivedPercentage = data.enhancedMetrics.statusBreakdown.archived;
  const totalStatus = activePercentage + draftPercentage + archivedPercentage;

      return (
    <div className="products-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Products Dashboard</h1>
        <div className="header-controls">
          <a 
            href={`https://${data.shop}/admin/products`} 
            className="action-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.Manage />
            Manage Products
          </a>
          <button 
            className="print-report-btn"
            onClick={() => window.print()}
          >
            <Icon.Print />
            Print Report
          </button>
        </div>
      </div>

      {/* Optimization Score */}
      <div className="optimization-score">
        <div className="score-card">
          <div className="score-value">{data.enhancedMetrics.optimizationScore}</div>
          <div className="score-label">Optimization Score</div>
          <div className="score-description">Based on analysis of {formatNumber(data.totalProducts)} products</div>
        </div>
        <div className="insights-pills">
          <Link 
            to="/attention"
            className={`insight-pill clickable ${data.insights.needsAttention > 0 ? 'warning' : 'success'}`}
          >
            <Icon.Attention />
            {data.insights.needsAttention} need attention
          </Link>
          <div className="insight-pill info non-clickable">
            <Icon.Growth />
            {data.insights.growthOpportunity} new this month
          </div>
          <div className="insight-pill info non-clickable">
            <Icon.SEO />
            {data.insights.seoImprovements} SEO improvements
          </div>
        </div>
      </div>

      {/* Products Overview Section */}
      <div className="products-overview">
        <h2><Icon.Products /> Products Overview</h2>
        <div className="primary-metrics-grid">
          <div className="metric-card total-products">
            <div className="metric-value">{formatNumber(data.totalProducts)}</div>
            <div className="metric-label">Total Products</div>
            <div className="metric-description">Complete catalog analysis</div>
          </div>
          
          <div className="metric-card active-products">
            <div className="metric-value">{formatNumber(data.activeProducts)}</div>
            <div className="metric-label">Active Products</div>
            <div className="metric-description">
              {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}% of total
            </div>
          </div>
          
          <div className="metric-card new-products">
            <div className="metric-value">{formatNumber(data.newProductsThisMonth)}</div>
            <div className="metric-label">New This Month</div>
            <div className="metric-description">Recent product additions</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h2><Icon.Chart /> Visual Analytics</h2>
        <div className="charts-grid">
          {/* Product Status Distribution */}
          <div className="chart-container">
            <h3>Product Status Distribution</h3>
            <div className="chart-placeholder pie-chart">
              <div className="chart-visual">
                <div 
                  className="pie-chart-visual"
                  style={{
                    background: `conic-gradient(
                      #28a745 0% ${data.chartData.statusData.activePercentage}%,
                      #ffc107 ${data.chartData.statusData.activePercentage}% ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}%,
                      #dc3545 ${data.chartData.statusData.activePercentage + data.chartData.statusData.draftPercentage}% 100%
                    )`
                  }}
                >
                  <div className="pie-center">
                    <div className="pie-total">{formatNumber(totalStatus)}</div>
                    <div className="pie-label">Products</div>
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(activePercentage)} active products (${formatPercentage(data.chartData.statusData.activePercentage)}% of total)`}>
                  <span className="legend-color active"></span>
                  <span>Active: {formatNumber(activePercentage)} ({formatPercentage(data.chartData.statusData.activePercentage)}%)</span>
                </div>
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(draftPercentage)} draft products (${formatPercentage(data.chartData.statusData.draftPercentage)}% of total)`}>
                  <span className="legend-color draft"></span>
                  <span>Draft: {formatNumber(draftPercentage)} ({formatPercentage(data.chartData.statusData.draftPercentage)}%)</span>
                </div>
                <div className="legend-item tooltip" data-tooltip={`${formatNumber(archivedPercentage)} archived products (${formatPercentage(data.chartData.statusData.archivedPercentage)}% of total)`}>
                  <span className="legend-color archived"></span>
                  <span>Archived: {formatNumber(archivedPercentage)} ({formatPercentage(data.chartData.statusData.archivedPercentage)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Collections */}
          <div className="chart-container">
            <h3>Top Collections</h3>
            <div className="chart-placeholder bar-chart">
              <div className="chart-visual">
                <div className="bar-chart-visual">
                  {data.chartData.topCollections.slice(0, 5).map((collection: any, index: number) => {
                    const maxCount = Math.max(...data.chartData.topCollections.map((c: any) => c.productCount));
                    const heightPercentage = maxCount > 0 ? 
                      Math.max(10, (collection.productCount / maxCount) * 100) : 10;
                    return (
                      <div key={collection.node.id} className="bar-container tooltip" data-tooltip={`${collection.node.title}: ${collection.productCount} products`}>
                        <div 
                          className="bar" 
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                        <div className="bar-label">{collection.node.title.split(' ')[0]}</div>
                        <div className="bar-value">{collection.productCount}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="chart-summary tooltip" data-tooltip={`Largest collection: ${data.collectionStats.largestCollection?.node.title || 'None'} with ${data.collectionStats.largestCollection?.productCount || 0} products`}>
                Total collections: {formatNumber(data.totalCollections)}
              </div>
            </div>
          </div>

          {/* Monthly Product Growth */}
          <div className="chart-container">
            <h3>Monthly Product Growth</h3>
            <div className="chart-placeholder line-chart">
              <div className="chart-visual">
                <div className="line-chart-visual">
                  <div className="line-graph">
                    <svg className="line-path" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path 
                        className="line" 
                        d={data.chartData.monthlyData.labels.map((label: string, index: number) => {
                          const maxData = Math.max(...data.chartData.monthlyData.data);
                          const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
                          const x = (index / (data.chartData.monthlyData.labels.length - 1)) * 100;
                          const y = 100 - heightPercentage;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#6f42c1"
                        strokeWidth="2"
                      />
                    </svg>
                    
                    {data.chartData.monthlyData.labels.map((label: string, index: number) => {
                      const maxData = Math.max(...data.chartData.monthlyData.data);
                      const heightPercentage = maxData > 0 ? (data.chartData.monthlyData.data[index] / maxData) * 100 : 0;
                      const value = data.chartData.monthlyData.data[index];
                      return (
                        <div 
                          key={label} 
                          className="data-point tooltip" 
                          data-tooltip={`${label}: ${value} new products`}
                          style={{ 
                            left: `${(index / (data.chartData.monthlyData.labels.length - 1)) * 100}%`,
                            bottom: `${heightPercentage}%`
                          }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="x-axis">
                    {data.chartData.monthlyData.labels.map((label: string) => (
                      <div key={label} className="x-label">{label}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="chart-summary tooltip" data-tooltip={`${data.enhancedMetrics.productTimeline.last30Days} products created in the last 30 days`}>
                Recent growth: {formatNumber(data.enhancedMetrics.productTimeline.last30Days)} products
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="inventory-section">
        <h2><Icon.Inventory /> Inventory Overview</h2>
        <div className="inventory-grid">
          <div className="inventory-card total-variants">
            <Tooltip text="Total number of product variants across all products">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.totalVariants)}</div>
            </Tooltip>
            <div className="inventory-label">Total Variants</div>
            <div className="inventory-status">
              <div className="status-dot healthy"></div>
              <span>All variants tracked</span>
            </div>
          </div>
          <div className="inventory-card out-of-stock">
            <Tooltip text="Variants currently out of stock that need restocking">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.outOfStock)}</div>
            </Tooltip>
            <div className="inventory-label">Out of Stock</div>
            <div className="inventory-status">
              <div className={`status-dot ${data.enhancedMetrics.inventory.outOfStock > 0 ? 'critical' : 'healthy'}`}></div>
              <span>{data.enhancedMetrics.inventory.outOfStock > 0 ? 'Needs attention' : 'All in stock'}</span>
            </div>
          </div>
          <div className="inventory-card low-stock">
            <Tooltip text="Variants with 5 or fewer items in stock">
              <div className="inventory-value">{formatNumber(data.enhancedMetrics.inventory.lowStock)}</div>
            </Tooltip>
            <div className="inventory-label">Low Stock</div>
            <div className="inventory-status">
              <div className={`status-dot ${data.enhancedMetrics.inventory.lowStock > 0 ? 'warning' : 'healthy'}`}></div>
              <span>{data.enhancedMetrics.inventory.lowStock > 0 ? 'Monitor closely' : 'Good levels'}</span>
            </div>
          </div>
          <div className="inventory-card inventory-value">
            <Tooltip text="Total value of all inventory at current prices">
              <div className="inventory-value">{formatCurrency(data.enhancedMetrics.inventory.inventoryValue)}</div>
            </Tooltip>
            <div className="inventory-label">Inventory Value</div>
            <div className="inventory-status">
              <div className="status-dot healthy"></div>
              <span>Total asset value</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Status & Timeline */}
      <div className="status-timeline-section">
        <div className="status-breakdown">
          <h3><Icon.Status /> Product Status</h3>
          <div className="status-grid">
            <div className="status-card active">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.active)}</div>
              <div className="status-label">Active</div>
            </div>
            <div className="status-card draft">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.draft)}</div>
              <div className="status-label">Draft</div>
            </div>
            <div className="status-card archived">
              <div className="status-value">{formatNumber(data.enhancedMetrics.statusBreakdown.archived)}</div>
              <div className="status-label">Archived</div>
            </div>
          </div>
        </div>

        <div className="timeline-breakdown">
          <h3><Icon.Timeline /> Product Timeline</h3>
          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last30Days)}</div>
              <div className="timeline-label">Last 30 Days</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.last90Days)}</div>
              <div className="timeline-label">Last 90 Days</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-value">{formatNumber(data.enhancedMetrics.productTimeline.thisYear)}</div>
              <div className="timeline-label">This Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Insights */}
      <div className="seo-section">
        <h2><Icon.SEO /> SEO Insights</h2>
        <div className="seo-grid">
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.missingMeta} products have short or missing descriptions that affect SEO`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingMeta)}</div>
            </Tooltip>
            <div className="seo-label">Missing Descriptions</div>
            <div className="seo-description">Products needing better descriptions</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingMeta / data.totalProducts) * 100} />
          </div>
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.shortTitles} products have titles shorter than 10 characters`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.shortTitles)}</div>
            </Tooltip>
            <div className="seo-label">Short Titles</div>
            <div className="seo-description">Titles under 10 characters</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.shortTitles / data.totalProducts) * 100} />
          </div>
          <div className="seo-card">
            <Tooltip text={`${data.enhancedMetrics.seoInsights.missingImages} products are missing featured images`}>
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.missingImages)}</div>
            </Tooltip>
            <div className="seo-label">Missing Images</div>
            <div className="seo-description">Products without featured images</div>
            <QualityBadge score={100 - (data.enhancedMetrics.seoInsights.missingImages / data.totalProducts) * 100} />
          </div>
          <div className="seo-card score">
            <Tooltip text="Overall SEO health score based on descriptions, titles, and images">
              <div className="seo-value">{formatNumber(data.enhancedMetrics.seoInsights.seoScore)}%</div>
            </Tooltip>
            <div className="seo-label">SEO Score</div>
            <div className="seo-description">Overall SEO health</div>
            <QualityBadge score={data.enhancedMetrics.seoInsights.seoScore} />
          </div>
        </div>
      </div>

      {/* Collections Overview Section */}
      <div className="collections-overview">
        <h2><Icon.Collections /> Collections Analytics</h2>
        
        <div className="collections-stats-grid">
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.totalCollections)}</div>
            <div className="collection-stat-label">Total Collections</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.collectionsWithProducts)}</div>
            <div className="collection-stat-label">With Products</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatNumber(data.collectionStats.emptyCollections)}</div>
            <div className="collection-stat-label">Empty Collections</div>
          </div>
          
          <div className="collection-stat-card">
            <div className="collection-stat-value">{formatPercentage(data.collectionStats.averageProductsPerCollection)}</div>
            <div className="collection-stat-label">Avg Products</div>
          </div>
        </div>

        {/* Largest Collection Highlight */}
        {data.collectionStats.largestCollection && data.collectionStats.largestCollection.productCount > 0 && (
          <div className="largest-collection">
            <h3><Icon.Trophy /> Largest Collection</h3>
            <div className="collection-name">
              {data.collectionStats.largestCollection.node.title}
            </div>
            <div className="product-count">
              {formatNumber(data.collectionStats.largestCollection.productCount)} products
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="performance-insights">
        <h2><Icon.Insights /> Performance Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-value">
              {data.totalProducts > 0 ? formatPercentage((data.activeProducts / data.totalProducts) * 100) : '0'}%
            </div>
            <div className="insight-label">Active Rate</div>
          </div>
          
          <div className="insight-item">
            <div className="insight-value">
              {data.totalCollections > 0 ? formatPercentage((data.collectionStats.collectionsWithProducts / data.totalCollections) * 100) : '0'}%
            </div>
            <div className="insight-label">Utilized Collections</div>
          </div>
          
          <div className="insight-item">
            <div className="insight-value">
              {data.totalCollections > 0 ? formatPercentage((data.collectionStats.emptyCollections / data.totalCollections) * 100) : '0'}%
            </div>
            <div className="insight-label">Empty Collections</div>
          </div>
        </div>
      </div>

      {/* Collections Breakdown */}
      <div className="collections-breakdown">
        <h2><Icon.Folder /> Collections Breakdown</h2>
        
        {data.collectionsWithCounts.length > 0 ? (
          <div className="collections-grid">
            {data.collectionsWithCounts.map((collection: any) => (
              <div key={collection.node.id} className="collection-card">
                <div className="collection-header">
                  <div className="collection-title">{collection.node.title}</div>
                  {collection.node.description && (
                    <div className="collection-description">
                      {collection.node.description}
                    </div>
                  )}
                </div>
                <div className="collection-stats">
                  <div className="product-count-badge">
                    {formatNumber(collection.productCount)} products
                  </div>
                  <div className={`collection-status ${collection.productCount > 0 ? 'status-active' : 'status-draft'}`}>
                    {collection.productCount > 0 ? 'Active' : 'Empty'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-collections">
            <h3>No Collections Found</h3>
            <p>Create collections to organize your products and improve customer experience.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2><Icon.Lightning /> Quick Actions</h2>
        <div className="actions-grid">
          <a 
            href={`https://${data.shop}/admin/products/new`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.AddProduct />
            <div className="action-title">Add New Product</div>
            <div className="action-description">Create a new product</div>
          </a>
          <a 
            href={`https://${data.shop}/admin/collections`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.ManageCollections />
            <div className="action-title">Manage Collections</div>
            <div className="action-description">Organize your products</div>
          </a>
          <a 
            href={`https://${data.shop}/admin/products/inventory`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.Inventory />
            <div className="action-title">Inventory Management</div>
            <div className="action-description">Update stock levels</div>
          </a>
          <div className="action-card" onClick={() => window.print()}>
            <Icon.Export />
            <div className="action-title">Export Report</div>
            <div className="action-description">Print or save as PDF</div>
          </div>
        </div>
      </div>
    </div>
  );
}