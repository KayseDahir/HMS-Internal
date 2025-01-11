import supabase, { supabaseUrl } from "./supabase";

// ///////////////////////////////////
// LOADING CABINS
// ///////////////////////////////////

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be loaded");
  }

  return data;
}

// ///////////////////////////////////
// step1: CREATING AND EDITING NEW CABIN
// ///////////////////////////////////

export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image?.name?.replaceAll(
    "/",
    ""
  )}`;

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}//storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");

  // A ) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select("id").single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // ///////////////////////////////////
  // step 2: uploading the image
  // ///////////////////////////////////
  if (hasImagePath) return data;
  
  const { error: StorageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // Delete the cabin if there was an error uploading image.
  if (StorageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(StorageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }
  return data;
}

// ///////////////////////////////////
// DELETING CABIN
// ///////////////////////////////////

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
