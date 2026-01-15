import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload, Video, X, CheckCircle } from "lucide-react";
import { VIDEO_CATEGORIES, VideoCategory } from "@/lib/videoCategories";

const ALLOWED_FORMATS = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface VideoUploadProps {
  onUploadComplete?: () => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<VideoCategory>("education");
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return "Invalid format. Allowed: MP4, WebM, MOV, AVI";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 100MB";
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    setUploadComplete(false);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simulate progress since Supabase doesn't provide upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, selectedFile);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase.from("videos").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        file_path: uploadData.path,
        file_size: selectedFile.size,
        format: selectedFile.type,
        category: category,
      });

      if (dbError) throw dbError;

      setProgress(100);
      setUploadComplete(true);
      toast.success("Video uploaded successfully!");
      
      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        setCategory("education");
        setProgress(0);
        setUploadComplete(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploadComplete?.();
      }, 2000);

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setCategory("education");
    setProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Upload Video</h3>
          <p className="text-sm text-muted-foreground">Share your skill tutorials</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Drop Zone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            selectedFile
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FORMATS.join(",")}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              {uploadComplete ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Video className="w-8 h-8 text-primary" />
              )}
              <div className="text-left">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">
                MP4, WebM, MOV, AVI (max 100MB)
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">{progress}% uploaded</p>
          </div>
        )}

        {/* Title, Category & Description */}
        {selectedFile && (
          <>
            <div className="space-y-2">
              <Label htmlFor="video-title">Title *</Label>
              <Input
                id="video-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a title"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as VideoCategory)}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description">Description</Label>
              <Textarea
                id="video-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this video teaches..."
                rows={3}
                disabled={uploading}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading || !title.trim()}
              className="w-full"
              variant="hero"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
