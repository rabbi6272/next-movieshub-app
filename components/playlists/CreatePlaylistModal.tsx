"use client";

import { useAuth } from "@/hooks/useAuth";
import { createPlaylist } from "@/hooks/usePlaylistServices";
import { PlaylistFormModal } from "./PlaylistFormModal";

export function CreatePlaylistModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { userID } = useAuth();

  return (
    <PlaylistFormModal
      title="Create Playlist"
      submitLabel="Create"
      onSubmit={async (values) => {
        if (!userID) {
          return { success: false, message: "Please login to create a playlist" };
        }
        return createPlaylist(userID, values);
      }}
      onClose={() => {
        onCreated();
        onClose();
      }}
    />
  );
}