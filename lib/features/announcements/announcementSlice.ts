import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store"; // Adjust path
import { Announcement } from "@/lib/schemas";

// --- Mock API Calls ---
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "uuid-announce-1",
    title: "GCE Results Are Out!",
    content:
      "The GCE 2025 Ordinary and Advanced Level results have been officially released. Candidates can check their results online at www.gceboard.cm or at their respective examination centers.",
    category: "Education",
    providerId: "provider-edu",
    providerName: "Ministry of Secondary Education",
    publicationDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "published",
  },
  {
    id: "uuid-announce-2",
    title: "Concours for ENAM Opens",
    content:
      "The entrance examination into the National School of Administration and Magistracy (ENAM) for the 2025/2026 academic year has been launched. Application deadline is July 30, 2025.",
    category: "Opportunities",
    providerId: "provider-minfopra",
    providerName: "Ministry of Public Service",
    publicationDate: new Date().toISOString(),
    status: "published",
    expiryDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  },
  {
    id: "uuid-announce-3",
    title: "Public Health Campaign: Vaccination Week",
    content:
      "A nationwide vaccination campaign for children aged 0-5 years will run from June 1st to June 7th. Visit your nearest health center.",
    category: "Health",
    providerId: "provider-health",
    providerName: "Ministry of Public Health",
    publicationDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "published",
  },
];

interface AnnouncementsState {
  items: Announcement[]; // Public announcements
  providerItems: Announcement[]; // Announcements specific to a logged-in provider
  loading: "idle" | "pending" | "succeeded" | "failed";
  providerLoading: "idle" | "pending" | "succeeded" | "failed"; // Separate loading for provider items
  error: string | null | undefined;
  providerError: string | null | undefined;
}

const initialState: AnnouncementsState = {
  items: [],
  providerItems: [],
  loading: "idle",
  providerLoading: "idle",
  error: null,
  providerError: null,
};

export const fetchPublicAnnouncements = createAsyncThunk(
  /* ... as before ... */
  "announcements/fetchPublic",
  async () => {
    const response = await fetchPublicAnnouncementsAPI();
    return response;
  }
);

export const createProviderAnnouncement = createAsyncThunk(
  /* ... as before ... */
  "announcements/createProvider",
  async (announcementData: Omit<Announcement, "id">, { getState }) => {
    const response = await createAnnouncementAPI(announcementData);
    return response;
  }
);

export const fetchProviderAnnouncements = createAsyncThunk(
  "announcements/fetchProvider",
  async (providerId: string, { getState }) => {
    // Optional: Check if already fetched and not stale
    // const { announcements } = getState() as RootState;
    // if (announcements.providerLoading === 'succeeded' && announcements.providerItems.length > 0) {
    //     return announcements.providerItems; // Or implement staleness check
    // }
    const response = await fetchProviderAnnouncementsAPI(providerId);
    return response;
  }
);

export const updateProviderAnnouncement = createAsyncThunk(
  "announcements/updateProvider",
  async (announcementData: Announcement, { getState }) => {
    // providerId and providerName should ideally be immutable or validated on backend
    const response = await updateAnnouncementAPI(announcementData);
    return response;
  }
);

export const deleteProviderAnnouncement = createAsyncThunk(
  "announcements/deleteProvider",
  async (announcementId: string, { getState }) => {
    await deleteAnnouncementAPI(announcementId);
    return announcementId; // Return ID for removal from state
  }
);

// --- Mock API Simulation Functions ---
const fetchPublicAnnouncementsAPI = async (): Promise<Announcement[]> => {
  console.log("[API MOCK] Fetching public announcements...");
  await new Promise((resolve) => setTimeout(resolve, 700));
  return MOCK_ANNOUNCEMENTS.filter(
    (a) =>
      a.status === "published" &&
      (!a.expiryDate || new Date(a.expiryDate) > new Date())
  );
};

const createAnnouncementAPI = async (
  data: Omit<Announcement, "id">
): Promise<Announcement> => {
  console.log("[API MOCK] Creating announcement...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newAnnouncement: Announcement = {
    ...data,
    id: `uuid-announce-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
  MOCK_ANNOUNCEMENTS.push(newAnnouncement);
  return newAnnouncement;
};

const fetchProviderAnnouncementsAPI = async (
  providerId: string
): Promise<Announcement[]> => {
  console.log(
    `[API MOCK] Fetching announcements for provider: ${providerId}...`
  );
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_ANNOUNCEMENTS.filter((a) => a.providerId === providerId);
};

const updateAnnouncementAPI = async (
  announcement: Announcement
): Promise<Announcement> => {
  console.log(`[API MOCK] Updating announcement: ${announcement.id}...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === announcement.id);
  if (index !== -1) {
    MOCK_ANNOUNCEMENTS[index] = {
      ...MOCK_ANNOUNCEMENTS[index],
      ...announcement,
    };
    return MOCK_ANNOUNCEMENTS[index];
  }
  throw new Error(
    `[API MOCK] Announcement with ID ${announcement.id} not found for update.`
  );
};

const deleteAnnouncementAPI = async (
  announcementId: string
): Promise<string> => {
  console.log(`[API MOCK] Deleting announcement: ${announcementId}...`);
  await new Promise((resolve) => setTimeout(resolve, 800));
  const index = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === announcementId);
  if (index !== -1) {
    MOCK_ANNOUNCEMENTS.splice(index, 1);
    return announcementId;
  }
  throw new Error(
    `[API MOCK] Announcement with ID ${announcementId} not found for delete.`
  );
};
// --- End Mock API Simulation Functions ---

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    // Could add local state manipulation here if needed, e.g., optimistic updates
  },
  extraReducers: (builder) => {
    builder
      // Public Announcements
      .addCase(fetchPublicAnnouncements.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchPublicAnnouncements.fulfilled,
        (state, action: PayloadAction<Announcement[]>) => {
          state.loading = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchPublicAnnouncements.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })

      // Provider Create Announcement
      .addCase(createProviderAnnouncement.pending, (state) => {
        state.providerLoading = "pending";
      }) // Use providerLoading or a specific createLoading
      .addCase(
        createProviderAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.providerLoading = "succeeded";
          state.providerItems.unshift(action.payload);
          // If it's immediately published, add to public items too
          if (
            action.payload.status === "published" &&
            (!action.payload.expiryDate ||
              new Date(action.payload.expiryDate) > new Date())
          ) {
            state.items.unshift(action.payload);
          }
        }
      )
      .addCase(createProviderAnnouncement.rejected, (state, action) => {
        state.providerLoading = "failed";
        state.providerError = action.error.message;
      })

      // Provider Fetch Announcements
      .addCase(fetchProviderAnnouncements.pending, (state) => {
        state.providerLoading = "pending";
      })
      .addCase(
        fetchProviderAnnouncements.fulfilled,
        (state, action: PayloadAction<Announcement[]>) => {
          state.providerLoading = "succeeded";
          state.providerItems = action.payload;
        }
      )
      .addCase(fetchProviderAnnouncements.rejected, (state, action) => {
        state.providerLoading = "failed";
        state.providerError = action.error.message;
      })

      // Provider Update Announcement
      .addCase(updateProviderAnnouncement.pending, (state) => {
        state.providerLoading = "pending";
      }) // or specific updateLoading
      .addCase(
        updateProviderAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.providerLoading = "succeeded";
          const index = state.providerItems.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.providerItems[index] = action.payload;
          }
          // Update public list as well
          const publicIndex = state.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (publicIndex !== -1) {
            if (
              action.payload.status === "published" &&
              (!action.payload.expiryDate ||
                new Date(action.payload.expiryDate) > new Date())
            ) {
              state.items[publicIndex] = action.payload;
            } else {
              state.items.splice(publicIndex, 1); // Remove if no longer public
            }
          } else if (
            action.payload.status === "published" &&
            (!action.payload.expiryDate ||
              new Date(action.payload.expiryDate) > new Date())
          ) {
            state.items.unshift(action.payload); // Add if newly published
          }
        }
      )
      .addCase(updateProviderAnnouncement.rejected, (state, action) => {
        state.providerLoading = "failed";
        state.providerError = action.error.message;
      })

      // Provider Delete Announcement
      .addCase(deleteProviderAnnouncement.pending, (state) => {
        state.providerLoading = "pending";
      }) // or specific deleteLoading
      .addCase(
        deleteProviderAnnouncement.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.providerLoading = "succeeded";
          state.providerItems = state.providerItems.filter(
            (item) => item.id !== action.payload
          );
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          ); // Remove from public list too
        }
      )
      .addCase(deleteProviderAnnouncement.rejected, (state, action) => {
        state.providerLoading = "failed";
        state.providerError = action.error.message;
      });
  },
});

// Selectors
export const selectAllPublicAnnouncements = (state: RootState) =>
  state.announcements.items;
export const selectAnnouncementsLoading = (state: RootState) =>
  state.announcements.loading;
export const selectAnnouncementsError = (state: RootState) =>
  state.announcements.error;

export const selectProviderAnnouncementsList = (state: RootState) =>
  state.announcements.providerItems;
export const selectProviderAnnouncementsLoading = (state: RootState) =>
  state.announcements.providerLoading;
export const selectProviderAnnouncementsError = (state: RootState) =>
  state.announcements.providerError;
export const selectAnnouncementById =
  (id: string | undefined) => (state: RootState) =>
    id
      ? state.announcements.items.find((a) => a.id === id) ||
        state.announcements.providerItems.find((a) => a.id === id)
      : undefined;

export default announcementsSlice.reducer;
