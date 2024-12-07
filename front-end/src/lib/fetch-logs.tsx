import supabase from "./supabase";

export async function fetchLogs() {
  const { data, error } = await supabase.from("logs").select("*");

  if (error) {
    console.error("Error fetching logs:", error.message);
    return { data: null, error };
  }

  console.log("logs", data);
  return { data, error: null };
}
