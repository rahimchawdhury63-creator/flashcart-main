// ============================================================
// FlashCart — SchemaOrg Component
// Injects Schema.org JSON-LD structured data.
// Separate from MetaTags for cleaner component separation.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SchemaOrg
 * Renders a Schema.org JSON-LD script tag.
 * Can accept single schema object or array of schemas.
 *
 * @param {object|Array} schema - Single or multiple Schema.org objects
 */
const SchemaOrg = ({ schema }) => {
  // Don't render if no schema provided
  if (!schema) return null;

  // Handle both single schema and array of schemas
  const schemas = Array.isArray(schema) ? schema : [schema];

  // Filter out null/undefined schemas
  const validSchemas = schemas.filter(Boolean);

  if (validSchemas.length === 0) return null;

  return (
    <Helmet>
      {validSchemas.map((schemaObj, index) => (
        // Each schema gets its own script tag
        // This is the correct pattern for multiple schemas
        <script
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(schemaObj, null, 0)} {/* Minified JSON for production */}
        </script>
      ))}
    </Helmet>
  );
};

export default SchemaOrg;
