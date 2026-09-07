"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import { ModalShell } from "./ModalShell";

export function PlaylistFormModal({
  title,
  submitLabel,
  initial = { name: "", description: "" },
  onSubmit,
  onClose,
}: {
  title: string;
  submitLabel: string;
  initial?: { name: string; description: string };
  onSubmit: (values: { name: string; description: string }) => Promise<{
    success: boolean;
    message: string;
  }>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please give your playlist a name");
      return;
    }

    try {
      setIsSubmitting(true);
      const { success, message } = await onSubmit({ name, description });
      if (success) {
        toast.success(message);
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="playlist-name"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Name
          </label>
          <input
            id="playlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Favorites, 90s Classics"
            maxLength={60}
            autoComplete="off"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
        </div>

        <div>
          <label
            htmlFor="playlist-description"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="playlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this playlist for?"
            maxLength={200}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitLabel}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}