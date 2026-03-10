import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Box, Music, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceService } from "../api/experience.service";
import type { Experience } from "../types/experience";

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  author: z.string().optional(),
  yearCreated: z.number().optional().nullable(),
  material: z.string().optional(),
  period: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface Props {
  experience: Experience;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditExperienceModal: React.FC<Props> = ({
  experience,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<{
    thumbnail: File | null;
    audio: File | null;
    model: File | null;
  }>({ thumbnail: null, audio: null, model: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: experience.title,
      description: experience.description,
      category: experience.category || "",
      author: experience.author || "",
      yearCreated: experience.yearCreated ?? null,
      material: experience.material || "",
      period: experience.period || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: EditFormValues) => {
      // Update text fields
      await experienceService.update(experience.id, values);
      // Upload new files if selected
      if (files.thumbnail)
        await experienceService.uploadThumbnail(experience.id, files.thumbnail);
      if (files.audio)
        await experienceService.uploadAudio(experience.id, files.audio);
      if (files.model)
        await experienceService.uploadModel(experience.id, files.model);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences", "me"] });
      onSuccess();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update experience");
    },
  });

  const onSubmit: SubmitHandler<EditFormValues> = (values) => {
    mutation.mutate(values);
  };

  const FileDrop = ({
    type,
    label,
    icon: Icon,
    accept,
    current,
  }: {
    type: keyof typeof files;
    label: string;
    icon: any;
    accept: string;
    current?: string | null;
  }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium mb-2 text-fg/60 ml-1">
        {label}
      </label>
      <div
        className={`relative h-28 glass rounded-2xl border-dashed border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer
        ${
          files[type]
            ? "border-accent/50 bg-accent/5"
            : current
              ? "border-fg/20 bg-fg/[0.02]"
              : "border-fg/10 hover:border-fg/20"
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) =>
            setFiles((prev) => ({
              ...prev,
              [type]: e.target.files?.[0] || null,
            }))
          }
        />
        {files[type] ? (
          <>
            <CheckCircle2 className="text-accent" size={22} />
            <span className="text-xs font-medium text-accent truncate max-w-[90%]">
              {files[type]?.name}
            </span>
          </>
        ) : current ? (
          <>
            <Icon className="text-accent/60" size={20} />
            <span className="text-[10px] text-fg/40">Existing file</span>
            <span className="text-[10px] text-fg/30">Click to replace</span>
          </>
        ) : (
          <>
            <Icon className="text-fg/20" size={20} />
            <span className="text-xs font-medium text-fg/40">
              Drop or click
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 rounded-4xl w-full max-w-4xl overflow-hidden relative z-10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Edit Experience</h2>
          <p className="text-fg/40">Update artifact details and media</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-fg/5 rounded-full transition-colors"
        >
          <X size={24} className="text-fg/40" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left: Text Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
                Author
              </label>
              <input
                {...register("author")}
                className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
                placeholder="Artist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
                Year Created
              </label>
              <input
                {...register("yearCreated", { valueAsNumber: true })}
                type="number"
                className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
                placeholder="1345"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
                Material
              </label>
              <input
                {...register("material")}
                className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
                placeholder="e.g. Marble"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
                Period
              </label>
              <input
                {...register("period")}
                className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
                placeholder="e.g. Renaissance"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors appearance-none"
            >
              <option value="sculpture" className="bg-card">Sculpture</option>
              <option value="painting" className="bg-card">Painting</option>
              <option value="jewelry" className="bg-card">Jewelry</option>
              <option value="pottery" className="bg-card">Pottery</option>
              <option value="textile" className="bg-card">Textile</option>
              <option value="archaeology" className="bg-card">Archaeology</option>
            </select>
          </div>
        </div>

        {/* Right: File Uploads */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-4">
              <FileDrop
                type="thumbnail"
                label="Thumbnail"
                icon={ImageIcon}
                accept="image/*"
                current={experience.thumbnailURL}
              />
              <FileDrop
                type="audio"
                label="Audio Guide"
                icon={Music}
                accept="audio/*"
                current={experience.audioLocation}
              />
            </div>
            <FileDrop
              type="model"
              label="3D Model (GLB)"
              icon={Box}
              accept=".glb,.gltf"
              current={experience.storageLocation}
            />
          </div>
          <div>
            <div className="h-px mb-4 mt-4" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)" }} />
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={mutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-fg/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EditExperienceModal;
