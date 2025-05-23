
import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

interface DocumentEmbedding {
  id: string;
  content: string;
  embedding?: number[];
  metadata?: Record<string, any>;
  userId: string;
}

interface SearchOptions {
  threshold: number;
  limit: number;
}

export function useDocumentEmbeddings() {
  const { supabase, loading: baseLoading, setLoading, handleError } = useSupabaseBase();
  const [loading, setLocalLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Store a document with its embedding
   */
  const storeDocument = async (
    content: string,
    embedding: number[],
    metadata: Record<string, any> = {},
    userId: string
  ): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      console.log(`Storing document for user ${userId}`);
      
      // Convert embedding array to string for storage
      const { error } = await supabase
        .from('document_embeddings')
        .insert({
          content,
          embedding: JSON.stringify(embedding),
          metadata,
          user_id: userId
        });
      
      if (error) throw error;
      
      toast({
        title: "Document stored",
        description: "Document has been stored successfully for vector search"
      });
      
      return true;
    } catch (err) {
      handleError(err, "Error storing document");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  
  /**
   * Update an existing document
   */
  const updateDocument = async (
    id: string, 
    content: string,
    embedding: number[],
    metadata: Record<string, any> = {},
    userId: string
  ): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      const { error } = await supabase
        .from('document_embeddings')
        .update({
          content,
          embedding: JSON.stringify(embedding),
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Document updated",
        description: "Document has been updated successfully"
      });
      
      return true;
    } catch (err) {
      handleError(err, "Error updating document");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  
  /**
   * Delete a document
   */
  const deleteDocument = async (id: string, userId: string): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      const { error } = await supabase
        .from('document_embeddings')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Document deleted",
        description: "Document has been removed from the vector store"
      });
      
      return true;
    } catch (err) {
      handleError(err, "Error deleting document");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  
  /**
   * Search for similar documents using the match_documents function
   */
  const searchSimilarDocuments = async (
    queryEmbedding: number[],
    userId: string,
    options: SearchOptions = { threshold: 0.5, limit: 5 }
  ): Promise<Array<{ id: string; content: string; metadata: Record<string, any>; similarity: number }>> => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('match_documents', {
          query_embedding: JSON.stringify(queryEmbedding),
          match_threshold: options.threshold,
          match_count: options.limit,
          user_id: userId
        });
      
      if (error) throw error;
      
      // Convert Json to Record<string, any>
      return (data || []).map(item => ({
        id: item.id,
        content: item.content,
        metadata: item.metadata as Record<string, any>,
        similarity: item.similarity
      }));
    } catch (err) {
      handleError(err, "Error searching documents");
      return [];
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  
  /**
   * Get all documents for a user
   */
  const getAllDocuments = async (userId: string): Promise<DocumentEmbedding[]> => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      // Using any to work around TypeScript validation
      const { data, error } = await supabase
        .from('document_embeddings')
        .select('id, content, metadata, user_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (!data) return [];
      
      return data.map((doc: any) => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata as Record<string, any>,
        userId: doc.user_id
      }));
    } catch (err) {
      handleError(err, "Error fetching documents");
      return [];
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return {
    loading: baseLoading || loading,
    storeDocument,
    updateDocument,
    deleteDocument,
    searchSimilarDocuments,
    getAllDocuments
  };
}
