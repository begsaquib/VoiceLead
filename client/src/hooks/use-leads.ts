import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ImportMetaEnv {
  VITE_DIRECTUS_URL?: string;
  VITE_DIRECTUS_TOKEN: string;
  VITE_BOOTH_ID: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// const DIRECTUS_URL = "https://b491837a4b1b.ngrok-free.app";
// const BOOTH_ID = "67bbb618-a6ee-4ede-bd30-7e3d53eddfb6";
// const DIRECTUS_TOKEN = "s4emciM7GGjVs-tOkSF3jCiOLZCL-hje";

const DIRECTUS_URL =
  import.meta.env.VITE_DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN as string;
const BOOTH_ID = import.meta.env.VITE_BOOTH_ID as string;

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string | null;
  interest?: string | null;
  status?: string;
  source?: string | null;
  date_created?: string | null;
  booth_id?: string;
};

type DirectusListResponse<T> = {
  data: T[];
};

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ["directus-leads", BOOTH_ID],
    queryFn: async () => {
      const url = `${DIRECTUS_URL}/items/leads?filter[booth_id][_eq]=${BOOTH_ID}&fields=*,date_created`;

      console.log("🔍 Fetching:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("📡 Status:", res.status, res.ok, "bodyUsed:", res.bodyUsed);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // 👈 SINGLE PARSE - logs raw response
      const rawText = await res.clone().text();
      console.log("📄 Raw response:", rawText);

      const json: DirectusListResponse<Lead> = JSON.parse(rawText);
      console.log("✅ Parsed leads:", json.data);

      return json.data;
    },
  });
}

// Keep your useCreateLead as-is (it was fixed)
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      company: string;
      email: string;
      phone?: string;
      interest?: string;
    }) => {
      const res = await fetch(`${DIRECTUS_URL}/items/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({
          ...data,
          booth_id: BOOTH_ID,
          status: "new",
          source: "voice",
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Failed to create lead: ${errBody}`);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directus-leads", BOOTH_ID] });
    },
  });
}
