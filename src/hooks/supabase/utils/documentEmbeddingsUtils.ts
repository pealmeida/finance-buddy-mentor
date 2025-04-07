
/**
 * Utility functions for document embeddings
 */

// Simple helper to convert a number array to a Postgres vector type
export const formatEmbeddingForStorage = (embedding: number[]): string => {
  return `[${embedding.join(',')}]`;
};

// Check if an array is a vector-like structure (array of numbers)
export const isEmbeddingVector = (arr: any[]): boolean => {
  return (
    Array.isArray(arr) && 
    arr.length > 0 && 
    arr.every(item => typeof item === 'number')
  );
};

// Validate embedding dimensions
export const validateEmbeddingDimensions = (embedding: number[], expectedDimension: number = 1536): boolean => {
  return Array.isArray(embedding) && embedding.length === expectedDimension;
};

// Extract text content from a document (example implementation)
export const extractTextFromDocument = (content: string): string => {
  // Basic example - in reality this might process HTML, markdown, PDF text, etc.
  return content.replace(/(<([^>]+)>)/gi, ' ').trim();
};

// Prepare metadata from document properties
export const prepareDocumentMetadata = (
  title: string,
  source: string,
  tags: string[] = [],
  additionalProps: Record<string, any> = {}
): Record<string, any> => {
  return {
    title,
    source,
    tags,
    extractedAt: new Date().toISOString(),
    ...additionalProps
  };
};
