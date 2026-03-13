import { useState } from "react";
import type { FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X, Box, Music, Image as ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceService } from "../api/experience.service";

import {
  type ExperienceFormValues,
  experienceSchema,
} from "../schema/experience.schema";
import { FileDropzone } from "../components/common/FileDropzone";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateExperienceForm: FC<Props> = ({ onSuccess, onCancel }) => {
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
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "sculpture",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => experienceService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences", "me"] });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Failed to create experience:", error);
      alert(error.response?.data?.message || "Failed to create experience");
    },
  });

  const onSubmit: SubmitHandler<ExperienceFormValues> = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    if (files.thumbnail) formData.append("thumbnail", files.thumbnail);
    if (files.audio) formData.append("audio", files.audio);
    if (files.model) formData.append("model", files.model);

    mutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 rounded-4xl w-full max-w-4xl overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">New Experience</h2>
          <p className="text-fg/40">Create a digital twin for your artifact</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-fg/5 rounded-full transition-colors cursor-pointer"
        >
          <X size={24} className="text-fg/40" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1 text-fg/60">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 focus:border-accent/50 outline-none transition-colors"
              placeholder="Artifact Name"
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
              placeholder="Historical context and details..."
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
                Year
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
              <option value="sculpture" className="bg-card">
                Sculpture
              </option>
              <option value="painting" className="bg-card">
                Painting
              </option>
              <option value="jewelry" className="bg-card">
                Jewelry
              </option>
              <option value="pottery" className="bg-card">
                Pottery
              </option>
              <option value="textile" className="bg-card">
                Textile
              </option>
              <option value="archaeology" className="bg-card">
                Archaeology
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-4">
              <FileDropzone
                label="Thumbnail"
                icon={ImageIcon}
                accept="image/*"
                file={files.thumbnail}
                onFileSelect={(f) => setFiles((p) => ({ ...p, thumbnail: f }))}
              />
              <FileDropzone
                label="Audio Guide"
                icon={Music}
                accept="audio/*"
                file={files.audio}
                onFileSelect={(f) => setFiles((p) => ({ ...p, audio: f }))}
              />
            </div>
            <FileDropzone
              label="3D Model (GLB)"
              icon={Box}
              accept=".glb,.gltf"
              file={files.model}
              onFileSelect={(f) => setFiles((p) => ({ ...p, model: f }))}
            />
          </div>
          <div>
            <div
              className="h-px mb-4 mt-4"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={mutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-fg/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Experience"
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateExperienceForm;
