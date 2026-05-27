/**
 * =============================================================================
 * FLASHCART — FAQ Schema
 * =============================================================================
 *
 * Purpose: Schema.org FAQPage markup for frequently asked questions.
 * Enables FAQ rich results with expandable Q&A in search results.
 *
 * Usage:
 *   <FAQSchema faqs={[
 *     { question: "How does FlashCart work?", answer: "FlashCart is..." },
 *     { question: "Is it free?", answer: "Yes, FlashCart is..." }
 *   ]} />
 *
 * Developer: Rizwan Rahim Chowdhury
 * =============================================================================
 */

import React from 'react';
import JsonLd from '../JsonLd';

const FAQSchema = ({ faqs = [] }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return <JsonLd data={schema} />;
};

export default FAQSchema;
