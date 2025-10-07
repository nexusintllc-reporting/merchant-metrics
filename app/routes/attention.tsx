// // ==================== IMPORTS ====================
// import { LoaderFunctionArgs, json } from "@remix-run/node";
// import { useLoaderData, Link } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import "../styles/products.css";

// // ==================== TYPES ====================
// interface AttentionData {
//   inventory: {
//     outOfStock: number;
//     lowStock: number;
//     outOfStockProducts: any[];
//     lowStockProducts: any[];
//   };
//   seoInsights: {
//     missingMeta: number;
//     shortTitles: number;
//     missingImages: number;
//     missingMetaProducts: any[];
//     shortTitleProducts: any[];
//     missingImageProducts: any[];
//   };
//   statusBreakdown: {
//     draft: number;
//   };
//   shop: string;
//   totalAttentionItems: number;
// }

// // ==================== LOADER ====================
// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   try {
//     const { admin, session } = await authenticate.admin(request);
//     const shop = session.shop;

//     // Fetch products (similar to products loader but focused on attention items)
//     let allProducts: any[] = [];
//     let hasNextPage = true;
//     let endCursor: string | null = null;

//     while (hasNextPage && allProducts.length < 500) {
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
//                 handle
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
      
//       if (!hasNextPage || allProducts.length >= 500) break;
//     }

//     if (allProducts.length === 0) {
//       return json(getEmptyAttentionData(shop));
//     }

//     // Process attention data
//     const attentionData = await processAttentionData(admin, allProducts, shop);
//     return json(attentionData);
    
//   } catch (error: any) {
//     console.error("Error in attention loader:", error);
//     return json(getEmptyAttentionData(""));
//   }
// };

// // Helper functions for attention data
// async function processAttentionData(admin: any, allProducts: any[], shop: string) {
//   // Get inventory metrics
//   const inventoryMetrics = await getInventoryMetrics(admin, allProducts);
  
//   // Get SEO insights
//   const seoInsights = getSEOInsights(allProducts);
  
//   // Get status breakdown
//   const statusBreakdown = getProductStatusBreakdown(allProducts);

//   const totalAttentionItems = 
//     inventoryMetrics.outOfStock + 
//     inventoryMetrics.lowStock + 
//     seoInsights.missingMeta + 
//     seoInsights.shortTitles + 
//     seoInsights.missingImages + 
//     statusBreakdown.draft;

//   return {
//     inventory: {
//       outOfStock: inventoryMetrics.outOfStock,
//       lowStock: inventoryMetrics.lowStock,
//       outOfStockProducts: inventoryMetrics.outOfStockProducts,
//       lowStockProducts: inventoryMetrics.lowStockProducts
//     },
//     seoInsights: {
//       missingMeta: seoInsights.missingMeta,
//       shortTitles: seoInsights.shortTitles,
//       missingImages: seoInsights.missingImages,
//       missingMetaProducts: seoInsights.missingMetaProducts,
//       shortTitleProducts: seoInsights.shortTitleProducts,
//       missingImageProducts: seoInsights.missingImageProducts
//     },
//     statusBreakdown: {
//       draft: statusBreakdown.draft
//     },
//     shop: shop,
//     totalAttentionItems: totalAttentionItems
//   };
// }

// function getEmptyAttentionData(shop: string): AttentionData {
//   return {
//     inventory: {
//       outOfStock: 0,
//       lowStock: 0,
//       outOfStockProducts: [],
//       lowStockProducts: []
//     },
//     seoInsights: {
//       missingMeta: 0,
//       shortTitles: 0,
//       missingImages: 0,
//       missingMetaProducts: [],
//       shortTitleProducts: [],
//       missingImageProducts: []
//     },
//     statusBreakdown: {
//       draft: 0
//     },
//     shop: shop,
//     totalAttentionItems: 0
//   };
// }

// // Reuse the same helper functions from products.tsx
// async function getInventoryMetrics(admin: any, allProducts: any[]) {
//   let totalVariants = 0;
//   let outOfStockCount = 0;
//   let lowStockCount = 0;
//   let totalInventoryValue = 0;
  
//   const outOfStockProducts: any[] = [];
//   const lowStockProducts: any[] = [];
  
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
//       id: p.node.id,
//       handle: p.node.handle
//     })),
//     shortTitleProducts: productsWithShortTitles.slice(0, 10).map((p: any) => ({
//       title: p.node.title,
//       id: p.node.id,
//       handle: p.node.handle
//     })),
//     missingImageProducts: productsWithMissingImages.slice(0, 10).map((p: any) => ({
//       title: p.node.title,
//       id: p.node.id,
//       handle: p.node.handle
//     }))
//   };
// }

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

// // Formatting functions
// const formatNumber = (num: number | null | undefined) => {
//   if (num === null || num === undefined || isNaN(num)) return '0';
//   return num.toLocaleString();
// };

// // ==================== COMPONENT ====================
// export default function AttentionPage() {
//   const data = useLoaderData<typeof loader>();

//   return (
//     <div className="attention-page">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-main">
//           <Link to="/app" className="back-button">
//             ← Back to Dashboard
//           </Link>
//           <h1>🚨 Needs Immediate Attention</h1>
//           <div className="attention-summary">
//             {data.totalAttentionItems} items need your attention
//           </div>
//         </div>
//       </div>

//       {/* Inventory Issues */}
//       {(data.inventory.outOfStockProducts.length > 0 || data.inventory.lowStockProducts.length > 0) && (
//         <div className="attention-section">
//           <h2>📦 Inventory Issues</h2>
          
//           {/* Out of Stock */}
//           {data.inventory.outOfStockProducts.length > 0 && (
//             <div className="issue-category">
//               <h3 className="issue-title out-of-stock">
//                 🔴 Out of Stock ({formatNumber(data.inventory.outOfStock)} estimated products)
//               </h3>
//               <div className="product-list">
//                 {data.inventory.outOfStockProducts.map((product: any, index: number) => (
//                   <div key={index} className="product-item">
//                     <span className="product-name">{product.title}</span>
//                     <a 
//                       href={`https://${data.shop}/admin/products/${product.handle}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="action-link"
//                     >
//                       Manage Stock
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Low Stock */}
//           {data.inventory.lowStockProducts.length > 0 && (
//             <div className="issue-category">
//               <h3 className="issue-title low-stock">
//                 🟡 Low Stock ({formatNumber(data.inventory.lowStock)} estimated products)
//               </h3>
//               <div className="product-list">
//                 {data.inventory.lowStockProducts.map((product: any, index: number) => (
//                   <div key={index} className="product-item">
//                     <span className="product-name">{product.title}</span>
//                     <a 
//                       href={`https://${data.shop}/admin/products/${product.handle}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="action-link"
//                     >
//                       Restock
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* SEO Issues */}
//       {(data.seoInsights.missingMetaProducts.length > 0 || data.seoInsights.shortTitleProducts.length > 0 || data.seoInsights.missingImageProducts.length > 0) && (
//         <div className="attention-section">
//           <h2>🔍 SEO Improvements Needed</h2>
          
//           {/* Missing Descriptions */}
//           {data.seoInsights.missingMetaProducts.length > 0 && (
//             <div className="issue-category">
//               <h3 className="issue-title missing-meta">
//                 📝 Missing Descriptions ({formatNumber(data.seoInsights.missingMeta)} products)
//               </h3>
//               <div className="product-list">
//                 {data.seoInsights.missingMetaProducts.map((product: any, index: number) => (
//                   <div key={index} className="product-item">
//                     <span className="product-name">{product.title}</span>
//                     <a 
//                       href={`https://${data.shop}/admin/products/${product.handle}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="action-link"
//                     >
//                       Add Description
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Short Titles */}
//           {data.seoInsights.shortTitleProducts.length > 0 && (
//             <div className="issue-category">
//               <h3 className="issue-title short-titles">
//                 🏷️ Short Titles ({formatNumber(data.seoInsights.shortTitles)} products)
//               </h3>
//               <div className="product-list">
//                 {data.seoInsights.shortTitleProducts.map((product: any, index: number) => (
//                   <div key={index} className="product-item">
//                     <span className="product-name">{product.title}</span>
//                     <a 
//                       href={`https://${data.shop}/admin/products/${product.handle}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="action-link"
//                     >
//                       Edit Title
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Missing Images */}
//           {data.seoInsights.missingImageProducts.length > 0 && (
//             <div className="issue-category">
//               <h3 className="issue-title missing-images">
//                 🖼️ Missing Images ({formatNumber(data.seoInsights.missingImages)} products)
//               </h3>
//               <div className="product-list">
//                 {data.seoInsights.missingImageProducts.map((product: any, index: number) => (
//                   <div key={index} className="product-item">
//                     <span className="product-name">{product.title}</span>
//                     <a 
//                       href={`https://${data.shop}/admin/products/${product.handle}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="action-link"
//                     >
//                       Add Image
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Draft Products */}
//       {data.statusBreakdown.draft > 0 && (
//         <div className="attention-section">
//           <h2>📋 Draft Products</h2>
//           <div className="issue-category">
//             <h3 className="issue-title draft-products">
//               ✏️ Unpublished Drafts ({formatNumber(data.statusBreakdown.draft)} products)
//             </h3>
//             <p className="issue-description">
//               These products are saved as drafts and not visible to customers.
//             </p>
//             <a 
//               href={`https://${data.shop}/admin/products?status=draft`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="action-button large"
//             >
//               Review Draft Products
//             </a>
//           </div>
//         </div>
//       )}

//       {data.totalAttentionItems === 0 && (
//         <div className="no-issues">
//           <h3>🎉 All Good!</h3>
//           <p>No immediate attention needed. Your products are well-optimized!</p>
//           <Link to="/app" className="back-to-dashboard">
//             Return to Dashboard
//           </Link>
//         </div>
//       )}

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2>⚡ Quick Actions</h2>
//         <div className="actions-grid">
//           <a 
//             href={`https://${data.shop}/admin/products`} 
//             className="action-card" 
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <div className="action-icon">📦</div>
//             <div className="action-title">Manage All Products</div>
//             <div className="action-description">View and edit all products</div>
//           </a>
//           <a 
//             href={`https://${data.shop}/admin/inventory`} 
//             className="action-card" 
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <div className="action-icon">📊</div>
//             <div className="action-title">Inventory Management</div>
//             <div className="action-description">Update stock levels</div>
//           </a>
//           <Link to="/app" className="action-card">
//             <div className="action-icon">📈</div>
//             <div className="action-title">Back to Dashboard</div>
//             <div className="action-description">Return to main analytics</div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// ==================== IMPORTS ====================
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import "../styles/products.css";

// ==================== TYPES ====================
interface AttentionData {
  inventory: {
    outOfStock: number;
    lowStock: number;
    outOfStockProducts: any[];
    lowStockProducts: any[];
  };
  seoInsights: {
    missingMeta: number;
    shortTitles: number;
    missingImages: number;
    missingMetaProducts: any[];
    shortTitleProducts: any[];
    missingImageProducts: any[];
  };
  statusBreakdown: {
    draft: number;
  };
  shop: string;
  totalAttentionItems: number;
}

// ==================== LOADER ====================
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shop = session.shop;

    // Fetch products (similar to products loader but focused on attention items)
    let allProducts: any[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage && allProducts.length < 500) {
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
                handle
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
      
      if (!hasNextPage || allProducts.length >= 500) break;
    }

    if (allProducts.length === 0) {
      return json(getEmptyAttentionData(shop));
    }

    // Process attention data
    const attentionData = await processAttentionData(admin, allProducts, shop);
    return json(attentionData);
    
  } catch (error: any) {
    console.error("Error in attention loader:", error);
    return json(getEmptyAttentionData(""));
  }
};

// Helper functions for attention data
async function processAttentionData(admin: any, allProducts: any[], shop: string) {
  // Get inventory metrics
  const inventoryMetrics = await getInventoryMetrics(admin, allProducts);
  
  // Get SEO insights
  const seoInsights = getSEOInsights(allProducts);
  
  // Get status breakdown
  const statusBreakdown = getProductStatusBreakdown(allProducts);

  const totalAttentionItems = 
    inventoryMetrics.outOfStock + 
    inventoryMetrics.lowStock + 
    seoInsights.missingMeta + 
    seoInsights.shortTitles + 
    seoInsights.missingImages + 
    statusBreakdown.draft;

  return {
    inventory: {
      outOfStock: inventoryMetrics.outOfStock,
      lowStock: inventoryMetrics.lowStock,
      outOfStockProducts: inventoryMetrics.outOfStockProducts,
      lowStockProducts: inventoryMetrics.lowStockProducts
    },
    seoInsights: {
      missingMeta: seoInsights.missingMeta,
      shortTitles: seoInsights.shortTitles,
      missingImages: seoInsights.missingImages,
      missingMetaProducts: seoInsights.missingMetaProducts,
      shortTitleProducts: seoInsights.shortTitleProducts,
      missingImageProducts: seoInsights.missingImageProducts
    },
    statusBreakdown: {
      draft: statusBreakdown.draft
    },
    shop: shop,
    totalAttentionItems: totalAttentionItems
  };
}

function getEmptyAttentionData(shop: string): AttentionData {
  return {
    inventory: {
      outOfStock: 0,
      lowStock: 0,
      outOfStockProducts: [],
      lowStockProducts: []
    },
    seoInsights: {
      missingMeta: 0,
      shortTitles: 0,
      missingImages: 0,
      missingMetaProducts: [],
      shortTitleProducts: [],
      missingImageProducts: []
    },
    statusBreakdown: {
      draft: 0
    },
    shop: shop,
    totalAttentionItems: 0
  };
}

// Reuse the same helper functions from products.tsx
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
          id: product.node.id,
          handle: variantsData.data?.product?.handle,
          type: 'out_of_stock'
        });
      } else if (productLowStock) {
        lowStockProducts.push({
          title: variantsData.data?.product?.title,
          id: product.node.id,
          handle: variantsData.data?.product?.handle,
          type: 'low_stock'
        });
      }
      
    } catch (error) {
      console.error(`Error fetching variants for product ${product.node.id}:`, error);
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
      id: p.node.id,
      handle: p.node.handle
    })),
    shortTitleProducts: productsWithShortTitles.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id,
      handle: p.node.handle
    })),
    missingImageProducts: productsWithMissingImages.slice(0, 10).map((p: any) => ({
      title: p.node.title,
      id: p.node.id,
      handle: p.node.handle
    }))
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

// Helper function to extract product ID from GraphQL ID
const getProductIdFromGid = (gid: string): string => {
  // GraphQL ID format: gid://shopify/Product/1234567890
  const parts = gid.split('/');
  return parts[parts.length - 1];
};

// Formatting functions
const formatNumber = (num: number | null | undefined) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString();
};

// ==================== COMPONENT ====================
export default function AttentionPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="attention-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-main">
          <Link to="/app" className="back-button">
            ← Back to Dashboard
          </Link>
          <h1>🚨 Needs Immediate Attention</h1>
          <div className="attention-summary">
            {data.totalAttentionItems} items need your attention
          </div>
        </div>
      </div>

      {/* Inventory Issues */}
      {(data.inventory.outOfStockProducts.length > 0 || data.inventory.lowStockProducts.length > 0) && (
        <div className="attention-section">
          <h2>📦 Inventory Issues</h2>
          
          {/* Out of Stock */}
          {data.inventory.outOfStockProducts.length > 0 && (
            <div className="issue-category">
              <h3 className="issue-title out-of-stock">
                🔴 Out of Stock ({formatNumber(data.inventory.outOfStock)} estimated products)
              </h3>
              <div className="product-list">
                {data.inventory.outOfStockProducts.map((product: any, index: number) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.title}</span>
                    <a 
                      href={`https://${data.shop}/admin/products/${getProductIdFromGid(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Manage Stock
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Low Stock */}
          {data.inventory.lowStockProducts.length > 0 && (
            <div className="issue-category">
              <h3 className="issue-title low-stock">
                🟡 Low Stock ({formatNumber(data.inventory.lowStock)} estimated products)
              </h3>
              <div className="product-list">
                {data.inventory.lowStockProducts.map((product: any, index: number) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.title}</span>
                    <a 
                      href={`https://${data.shop}/admin/products/${getProductIdFromGid(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Restock
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO Issues */}
      {(data.seoInsights.missingMetaProducts.length > 0 || data.seoInsights.shortTitleProducts.length > 0 || data.seoInsights.missingImageProducts.length > 0) && (
        <div className="attention-section">
          <h2>🔍 SEO Improvements Needed</h2>
          
          {/* Missing Descriptions */}
          {data.seoInsights.missingMetaProducts.length > 0 && (
            <div className="issue-category">
              <h3 className="issue-title missing-meta">
                📝 Missing Descriptions ({formatNumber(data.seoInsights.missingMeta)} products)
              </h3>
              <div className="product-list">
                {data.seoInsights.missingMetaProducts.map((product: any, index: number) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.title}</span>
                    <a 
                      href={`https://${data.shop}/admin/products/${getProductIdFromGid(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Add Description
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Short Titles */}
          {data.seoInsights.shortTitleProducts.length > 0 && (
            <div className="issue-category">
              <h3 className="issue-title short-titles">
                🏷️ Short Titles ({formatNumber(data.seoInsights.shortTitles)} products)
              </h3>
              <div className="product-list">
                {data.seoInsights.shortTitleProducts.map((product: any, index: number) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.title}</span>
                    <a 
                      href={`https://${data.shop}/admin/products/${getProductIdFromGid(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Edit Title
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Images */}
          {data.seoInsights.missingImageProducts.length > 0 && (
            <div className="issue-category">
              <h3 className="issue-title missing-images">
                🖼️ Missing Images ({formatNumber(data.seoInsights.missingImages)} products)
              </h3>
              <div className="product-list">
                {data.seoInsights.missingImageProducts.map((product: any, index: number) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.title}</span>
                    <a 
                      href={`https://${data.shop}/admin/products/${getProductIdFromGid(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      Add Image
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Draft Products */}
      {data.statusBreakdown.draft > 0 && (
        <div className="attention-section">
          <h2>📋 Draft Products</h2>
          <div className="issue-category">
            <h3 className="issue-title draft-products">
              ✏️ Unpublished Drafts ({formatNumber(data.statusBreakdown.draft)} products)
            </h3>
            <p className="issue-description">
              These products are saved as drafts and not visible to customers.
            </p>
            <a 
              href={`https://${data.shop}/admin/products?status=draft`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button large"
            >
              Review Draft Products
            </a>
          </div>
        </div>
      )}

      {data.totalAttentionItems === 0 && (
        <div className="no-issues">
          <h3>🎉 All Good!</h3>
          <p>No immediate attention needed. Your products are well-optimized!</p>
          <Link to="/app" className="back-to-dashboard">
            Return to Dashboard
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <a 
            href={`https://${data.shop}/admin/products`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="action-icon">📦</div>
            <div className="action-title">Manage All Products</div>
            <div className="action-description">View and edit all products</div>
          </a>
          <a 
            href={`https://${data.shop}/admin/inventory`} 
            className="action-card" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="action-icon">📊</div>
            <div className="action-title">Inventory Management</div>
            <div className="action-description">Update stock levels</div>
          </a>
          <Link to="/app" className="action-card">
            <div className="action-icon">📈</div>
            <div className="action-title">Back to Dashboard</div>
            <div className="action-description">Return to main analytics</div>
          </Link>
        </div>
      </div>
    </div>
  );
}