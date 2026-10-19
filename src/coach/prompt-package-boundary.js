import { compilePromptPackage } from "./creative-harness.js";

/**
 * Persisting an immutable Prompt Package is a separate seam from generating a
 * video. The caller supplies the authenticated owner and repository; neither a
 * guest nor a browser can select another owner through this interface.
 */
export async function exportPromptPackage({ confirmedBrief, ownerId, repository }) {
  if (!confirmedBrief?.creativeBrief || confirmedBrief.ownerId !== ownerId) {
    return { ok: false, message: "ไม่พบ Creative Brief ที่ยืนยันแล้ว" };
  }
  const promptPackage = compilePromptPackage(confirmedBrief.creativeBrief);
  if (promptPackage.qualityGate.status === "block") {
    return { ok: false, message: "Creative Brief นี้ยังสร้างไม่ได้ กรุณาแก้ไขข้อจำกัดที่แจ้งไว้", qualityGate: promptPackage.qualityGate };
  }

  try {
    const saved = await repository.create({
      ownerId,
      confirmedCreativeBriefId: confirmedBrief.id,
      providerProfile: promptPackage.providerProfile,
      promptPackage,
    });
    return { ok: true, promptPackage: saved };
  } catch {
    return { ok: false, message: "บันทึก Prompt Package ไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }
}

export function createInMemoryPromptPackageRepository() {
  const records = [];
  return {
    async create({ ownerId, confirmedCreativeBriefId, providerProfile, promptPackage }) {
      const record = { id: `package-${records.length + 1}`, ownerId, confirmedCreativeBriefId, providerProfile, promptPackage };
      records.push(record);
      return record;
    },
    async findForOwner(ownerId, id) {
      return records.find((record) => record.ownerId === ownerId && record.id === id) ?? null;
    },
  };
}

export function createSupabasePromptPackageRepository(supabase) {
  return {
    async create({ ownerId, confirmedCreativeBriefId, providerProfile, promptPackage }) {
      const { data, error } = await supabase
        .from("prompt_packages")
        .insert({
          owner_id: ownerId,
          confirmed_creative_brief_id: confirmedCreativeBriefId,
          provider_profile: providerProfile,
          package: promptPackage,
        })
        .select("id, owner_id, confirmed_creative_brief_id, provider_profile, package")
        .single();
      if (error) throw error;
      return {
        id: data.id,
        ownerId: data.owner_id,
        confirmedCreativeBriefId: data.confirmed_creative_brief_id,
        providerProfile: data.provider_profile,
        promptPackage: data.package,
      };
    },
    async findForOwner(ownerId, id) {
      const { data, error } = await supabase
        .from("prompt_packages")
        .select("id, owner_id, confirmed_creative_brief_id, provider_profile, package")
        .eq("id", id)
        .eq("owner_id", ownerId)
        .maybeSingle();
      if (error) throw error;
      return data ? {
        id: data.id,
        ownerId: data.owner_id,
        confirmedCreativeBriefId: data.confirmed_creative_brief_id,
        providerProfile: data.provider_profile,
        promptPackage: data.package,
      } : null;
    },
  };
}
