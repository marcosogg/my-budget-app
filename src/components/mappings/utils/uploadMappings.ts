import { supabase } from "@/integrations/supabase/client";

interface CategoryMapping {
  category: string;
  descriptions: string[];
}

export async function uploadMappings(mappings: CategoryMapping[], userId: string) {
  let successCount = 0;
  let skipCount = 0;

  // Get all categories for the user
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .or(`user_id.eq.${userId},is_system.eq.true`);

  if (!categories) {
    throw new Error('Failed to fetch categories');
  }

  // Process each mapping
  for (const mapping of mappings) {
    // Find matching category
    const category = categories.find(
      c => c.name.toLowerCase() === mapping.category.toLowerCase()
    );

    if (!category) {
      console.log(`Category not found: ${mapping.category}`);
      continue;
    }

    // Process descriptions
    for (const description of mapping.descriptions) {
      // Check if mapping already exists
      const { data: existing } = await supabase
        .from('description_category_mappings')
        .select('id')
        .eq('description', description)
        .eq('user_id', userId)
        .single();

      if (existing) {
        skipCount++;
        continue;
      }

      // Create new mapping
      const { error } = await supabase
        .from('description_category_mappings')
        .insert({
          description,
          category_id: category.id,
          user_id: userId,
        });

      if (error) {
        console.error('Error creating mapping:', error);
        continue;
      }

      successCount++;
    }
  }

  return { successCount, skipCount };
}