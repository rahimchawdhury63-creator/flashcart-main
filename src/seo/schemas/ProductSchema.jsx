/**
 * =============================================================================
 * FLASHCART — Product Schema (For Individual Item Pages)
 * =============================================================================
 *
 * Purpose: Schema.org Product markup for individual menu items / products.
 * Enables product rich snippets, price display, availability in search results.
 *
 * Usage:
 *   <ProductSchema product={itemData} storeName="Rahim Restaurant" storeSlug="rahim-restaurant" />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://flashcart.bsdc.info.bd';

const ProductSchema = ({ product, storeName, storeSlug }) => {
  if (!product || !storeSlug) return null;

  const productUrl = `${BASE_URL}/store/${storeSlug}/item/${product.slug || product.id}`;
  const finalPrice = product.discountedPrice || product.price;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    alternateName: product.nameBn,
    description: product.description || `${product.name} from ${storeName}`,
    image: product.image,
    url: productUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: storeName
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BDT',
      price: finalPrice.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.isInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: storeName
      }
    }
  };

  /* Add discount info if applicable */
  if (product.discountedPrice && product.discountedPrice < product.price) {
    schema.offers.priceSpecification = {
      '@type': 'UnitPriceSpecification',
      price: product.discountedPrice,
      priceCurrency: 'BDT',
      referenceQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'C62'
      }
    };
  }

  /* Add aggregate rating if available */
  if (product.rating && product.ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.ratingCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  return <JsonLd data={schema} />;
};

export default ProductSchema;
