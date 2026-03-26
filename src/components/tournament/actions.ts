"use server";
 import { fetchServerside } from "@/lib/utils";
  import { cookies } from "next/headers";
   import { revalidatePath } from "next/cache";
   
   type CreateTournamentState = { 
    success: boolean; 
    error: string | null; 
};

export async function createTournament( 
 _prevState: CreateTournamentState, 
 formData: FormData 
): Promise<CreateTournamentState> {
 const full_name = formData.get("full_name");
  const shortened_name = 
  formData.get("shortened_name"); 
  
  const res = await fetchServerside("/tournaments", {
     method: "POST", 
     headers: { 
     Cookie: (await cookies()).toString(), 
    "Content-Type": "application/json",
 },
  body: JSON.stringify({ 
full_name,
shortened_name,
speech_time: 300,
end_protected_time: 30,
start_protected_time: 0,
ad_vocem_time: 60,
debate_time_slot: 120,
debate_preparation_time: 15,
beep_on_speech_end: true,
beep_on_protected_time: true,
 visualize_protected_time: false,
}),
});
             
if (!res.ok) { 
const errorText = await res.text();
console.error("Create tournament failed"); 
console.error("Status:", res.status); 
console.error("Response:", errorText); 

return {
success: false, 
error: "Failed to create tournament.", 
}; 
} 

revalidatePath("/tournaments"); 
return { 
success: true,
error: null, 
};
}