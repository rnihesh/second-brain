"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { Upload, Sparkles, Tags as TagsIcon, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { KnowledgeType } from "@/types";
import type { KnowledgeItem } from "@/types";

interface KnowledgeFormProps {
  initialData?: Partial<KnowledgeItem>;
  availableTags?: string[];
}

function KnowledgeForm({ initialData, availableTags = [] }: KnowledgeFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [content, setContent] = React.useState(initialData?.content ?? "");
  const [type, setType] = React.useState<KnowledgeType>(
    initialData?.type ?? KnowledgeType.NOTE
  );
  const [sourceUrl, setSourceUrl] = React.useState(initialData?.sourceUrl ?? "");
  const [tags, setTags] = React.useState<string[]>(
    initialData?.tags?.map((t) => t.name) ?? []
  );
  const [autoSummarize, setAutoSummarize] = React.useState(false);
  const [autoTag, setAutoTag] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [extracting, setExtracting] = React.useState(false);
  const [extracted, setExtracted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const extractFileContent = async (f: File) => {
    setExtracting(true);
    setExtracted(false);
    try {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent((prev) => prev ? `${prev}\n\n---\n\n${data.content}` : data.content);
          if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
          setExtracted(true);
          toast.success("File content extracted!");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to extract file content");
      }
    } catch {
      toast.error("Failed to extract file content");
    } finally {
      setExtracting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setFile(accepted[0]);
        extractFileContent(accepted[0]);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      // Upload file first if present
      let fileName: string | undefined;
      let fileType: string | undefined;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          fileName = uploadResult.filePath;
          fileType = uploadResult.fileType;
        }
      }

      const body: Record<string, unknown> = {
        title,
        content,
        type,
        tags,
        autoSummarize,
        autoTag,
      };
      if (type === KnowledgeType.LINK && sourceUrl) {
        body.sourceUrl = sourceUrl;
      }
      if (fileName) {
        body.fileName = fileName;
        body.fileType = fileType;
      }

      const url = isEdit
        ? `/api/knowledge/${initialData!.id}`
        : "/api/knowledge";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      const data = await res.json();
      toast.success(isEdit ? "Item updated!" : "Item created!");
      router.push(`/item/${data.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value as KnowledgeType)}
        options={[
          { value: KnowledgeType.NOTE, label: "Note" },
          { value: KnowledgeType.LINK, label: "Link" },
          { value: KnowledgeType.INSIGHT, label: "Insight" },
        ]}
      />

      {type === KnowledgeType.LINK && (
        <Input
          label="Source URL"
          placeholder="https://..."
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
      )}

      <Textarea
        label="Content"
        placeholder="Write your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={10000}
        showCount
        required
      />

      {/* File upload */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#8a8a8a]">
          Attachment
        </label>
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[rgba(255,255,255,0.06)] bg-[#2a2a2a] px-6 py-8 text-center transition-colors hover:border-[#c4a47c]/50",
            isDragActive && "border-[#c4a47c] bg-[#c4a47c]/5"
          )}
        >
          <input {...getInputProps()} />
          {extracting ? (
            <>
              <Loader2 className="mb-2 h-6 w-6 text-[#c4a47c] animate-spin" />
              <p className="text-sm text-[#c4a47c]">Extracting content from {file?.name}...</p>
            </>
          ) : file ? (
            <>
              {extracted ? (
                <Check className="mb-2 h-6 w-6 text-[#c4a47c]" />
              ) : (
                <Upload className="mb-2 h-6 w-6 text-[#8a8a8a]" />
              )}
              <p className="text-sm text-[#ececec]">{file.name}</p>
              {extracted && (
                <p className="mt-1 text-xs text-[#c4a47c]">Content extracted and added below</p>
              )}
            </>
          ) : (
            <>
              <Upload className="mb-2 h-6 w-6 text-[#8a8a8a]" />
              <p className="text-sm text-[#ececec]">
                Drop a file here or click to browse
              </p>
              <p className="mt-1 text-xs text-[#6b6b6b]">
                Images, PDF, TXT, MD — content will be extracted by AI
              </p>
            </>
          )}
        </div>
      </div>

      <TagInput
        label="Tags"
        tags={tags}
        onChange={setTags}
        suggestions={availableTags}
      />

      {/* Toggle switches */}
      <div className="flex flex-wrap gap-6">
        <ToggleSwitch
          icon={Sparkles}
          label="Auto-summarize"
          checked={autoSummarize}
          onChange={setAutoSummarize}
        />
        <ToggleSwitch
          icon={TagsIcon}
          label="Auto-tag"
          checked={autoTag}
          onChange={setAutoTag}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEdit ? "Update Item" : "Create Item"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ToggleSwitch({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-[#c4a47c]" : "bg-[#333333]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      <Icon className="h-4 w-4 text-[#8a8a8a]" />
      <span className="text-sm text-[#ececec]">{label}</span>
    </label>
  );
}

export { KnowledgeForm };
