export async function persistConfirmedCreativeBrief({ session, simulatedUserId, repository }) {
  if (!session?.creativeBrief?.confirmed) {
    return { ok: false, message: "กรุณายืนยัน Creative Brief ก่อนดำเนินการต่อ" };
  }

  try {
    const confirmedBrief = await repository.create({
      ownerId: simulatedUserId,
      creativeBrief: session.creativeBrief,
    });
    return { ok: true, confirmedBrief };
  } catch {
    return { ok: false, message: "บันทึก Creative Brief ไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }
}

export function createInMemoryConfirmedBriefRepository() {
  const records = [];
  return {
    async create({ ownerId, creativeBrief }) {
      const record = { id: `brief-${records.length + 1}`, ownerId, creativeBrief };
      records.push(record);
      return record;
    },
    async findForOwner(ownerId, id) {
      return records.find((record) => record.ownerId === ownerId && record.id === id) ?? null;
    },
    async listForOwner(ownerId) {
      return records.filter((record) => record.ownerId === ownerId);
    },
  };
}

export function createSupabaseConfirmedBriefRepository(supabase) {
  return {
    async create({ ownerId, creativeBrief }) {
      const { data, error } = await supabase
        .from("confirmed_creative_briefs")
        .insert({ owner_id: ownerId, creative_brief: creativeBrief })
        .select("id, owner_id, creative_brief")
        .single();
      if (error) throw error;
      return { id: data.id, ownerId: data.owner_id, creativeBrief: data.creative_brief };
    },
    async findForOwner(ownerId, id) {
      const { data, error } = await supabase
        .from("confirmed_creative_briefs")
        .select("id, owner_id, creative_brief")
        .eq("id", id)
        .eq("owner_id", ownerId)
        .maybeSingle();
      if (error) throw error;
      return data ? { id: data.id, ownerId: data.owner_id, creativeBrief: data.creative_brief } : null;
    },
    async listForOwner(ownerId) {
      const { data, error } = await supabase
        .from("confirmed_creative_briefs")
        .select("id, owner_id, creative_brief")
        .eq("owner_id", ownerId);
      if (error) throw error;
      return data.map((row) => ({ id: row.id, ownerId: row.owner_id, creativeBrief: row.creative_brief }));
    },
  };
}
