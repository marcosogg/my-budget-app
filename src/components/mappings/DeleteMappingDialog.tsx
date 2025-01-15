import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeleteMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mappingId: string;
}

export function DeleteMappingDialog({
  open,
  onOpenChange,
  mappingId,
}: DeleteMappingDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("description_category_mappings")
        .delete()
        .eq("id", mappingId);

      if (error) throw error;

      toast({ title: "Mapping deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["description-mappings"] });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the mapping",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the mapping.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}