
import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { useToast } from '@/components/ui/use-toast';

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
      
      const { error } = await supabase
        .from('document_embeddings')
        .insert({
          content,
          embedding,
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
          embedding,
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
          query_embedding: queryEmbedding,
          match_threshold: options.threshold,
          match_count: options.limit,
          user_id: userId
        });
      
      if (error) throw error;
      
      return data || [];
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
      
      const { data, error } = await supabase
        .from('document_embeddings')
        .select('id, content, metadata, user_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return (data || []).map(doc => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
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
