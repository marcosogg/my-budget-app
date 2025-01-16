import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MappingForm } from "./forms/MappingForm";

interface MappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapping?: {
    id: string;
    description: string;
    category_id: string;
  };
}

export function MappingDialog({ 
  open, 
  onOpenChange, 
  mapping 
}: MappingDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    description: mapping?.description ?? "",
    category_id: mapping?.category_id ?? "",
  };

  const handleSubmit = async (data: { description: string; category_id: string }) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (mapping) {
        const { error } = await supabase
          .from("description_category_mappings")
          .update({
            description: data.description,
            category_id: data.category_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", mapping.id);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Mapping and associated transactions have been updated" 
        });
      } else {
        const { error } = await supabase
          .from("description_category_mappings")
          .insert({
            description: data.description,
            category_id: data.category_id,
            user_id: user.id,
          });

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "New mapping created successfully" 
        });
      }

      queryClient.invalidateQueries({ queryKey: ["description-mappings"] });
      // Also invalidate categorized transactions as they might have been updated
      queryClient.invalidateQueries({ queryKey: ["categorizedTransactions"] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the mapping",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mapping ? "Edit Mapping" : "Add Mapping"}</DialogTitle>
        </DialogHeader>

        <MappingForm
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}