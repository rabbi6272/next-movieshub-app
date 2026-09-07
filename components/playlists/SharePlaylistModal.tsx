"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import {
  createShareLink,
  revokeShareLink,
  getShareForPlaylist,
  shareUrl,
} from "@/hooks/useShareServices";
import { ModalShell } from "./ModalShell";

export function SharePlaylistModal({
  playlistId,
  ownerId,
  onClose,
}: {
  playlistId: string;
  ownerId: string;
  onClose: () => void;
}) {
  const { userID } = useAuth();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isOwner = userID === ownerId;

  useEffect(() => {
    let mounted = true;
    if (isOwner) {
      getShareForPlaylist(playlistId, ownerId)
        .then((share) => {
          if (mounted && share) setToken(share.token);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [playlistId, ownerId, isOwner]);

  function invalidatePlaylistQueries() {
    queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
  }

  async function handleGenerate() {
    if (!isOwner) return;
    try {
      setIsGenerating(true);
      const { success, token: newToken } = await createShareLink(playlistId, ownerId);
      if (success) {
        setToken(newToken);
        toast.success("Share link created");
        invalidatePlaylistQueries();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevoke() {
    if (!isOwner) return;
    try {
      const { success } = await revokeShareLink(playlistId, ownerId);
      if (success) {
        setToken(null);
        toast.success("Share link revoked");
        invalidatePlaylistQueries();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCopy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(shareUrl(token));
      setIsCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <ModalShell title="Share Playlist" onClose={onClose}>
      {isLoading ? (
        <div className="py-8 flex justify-center">
          <span className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      ) : !isOwner ? (
        <p className="text-sm text-gray-500 text-center py-6">
          Only the owner can manage the share link for this playlist.
        </p>
      ) : token ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Anyone with this link can view your playlist.
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl(token)}
              onFocus={(e) => e.target.select()}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {isCopied ? "check" : "content_copy"}
              </span>
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <button
            onClick={handleRevoke}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">link_off</span>
            Revoke link
          </button>
        </div>
      ) : (
        <div className="space-y-4 py-2 text-center">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 text-gray-500">
            <span className="material-symbols-outlined text-3xl">share</span>
          </span>
          <p className="text-sm text-gray-600">
            Generate a link to share this playlist with anyone.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isGenerating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-base">link</span>
            )}
            Generate share link
          </button>
        </div>
      )}
    </ModalShell>
  );
}