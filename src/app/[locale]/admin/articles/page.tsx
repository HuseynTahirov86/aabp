"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles, addArticle, updateArticle, deleteArticle, AABPArticle } from "@/lib/firebase/db-articles";
import { Loader2, Trash2, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/firebase/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AdminCMSPage() {
  const { userData } = useAuth();
  const [articles, setArticles] = useState<AABPArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState<{ title: string, summary: string, content: string, imageUrl: string, status: 'Published' | 'Draft' }>({ title: '', summary: '', content: '', imageUrl: '', status: 'Published' });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    const data = await getArticles();
    setArticles(data);
    setLoading(false);
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    
    setIsAdding(true);
    try {
      if (editingArticleId) {
        await updateArticle(editingArticleId, {
          title: newArticle.title,
          summary: newArticle.summary,
          content: newArticle.content,
          imageUrl: newArticle.imageUrl,
          status: newArticle.status
        });
        toast.success("Article updated successfully");
      } else {
        await addArticle({
          ...newArticle,
          authorId: userData.id,
          authorName: `${userData.firstName} ${userData.lastName}`
        });
        toast.success("Article added successfully");
      }
      resetForm();
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save article");
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setNewArticle({ title: '', summary: '', content: '', imageUrl: '', status: 'Published' });
    setEditingArticleId(null);
  };

  const startEdit = (article: AABPArticle) => {
    setEditingArticleId(article.id || null);
    setNewArticle({
      title: article.title,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl || '',
      status: article.status
    });
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteArticle(deleteTargetId);
      toast.success("Article deleted");
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Articles CMS</h1>
          <p className="text-white/70 mt-2">Manage news and articles for the platform.</p>
        </div>
        <Button onClick={fetchArticles} variant="outline">Refresh List</Button>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this article? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create new article form */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-white/10 sticky top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {editingArticleId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                {editingArticleId ? "Edit Article" : "New Article"}
              </CardTitle>
              {editingArticleId && (
                <Button variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Title</label>
                  <Input required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="Article Title" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Summary</label>
                  <Textarea required value={newArticle.summary} onChange={e => setNewArticle({...newArticle, summary: e.target.value})} placeholder="Short description" rows={2} />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Content (HTML allowed)</label>
                  <Textarea required value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Full content..." rows={5} />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Image Upload</label>
                  <Input 
                    type="file" 
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('folder', 'articles');
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        if (!res.ok) throw new Error("Upload failed");
                        const data = await res.json();
                        setNewArticle({ ...newArticle, imageUrl: data.url });
                        toast.success("Image uploaded successfully");
                      } catch (err) {
                        toast.error("Failed to upload image");
                        console.error(err);
                      } finally {
                        setUploadingImage(false);
                      }
                    }} 
                  />
                  {newArticle.imageUrl && <p className="text-xs text-green-600 mt-1">Image URL generated: {newArticle.imageUrl}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Status</label>
                  <select
                    value={newArticle.status}
                    onChange={e => setNewArticle({...newArticle, status: e.target.value as 'Published' | 'Draft'})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isAdding || uploadingImage}>
                  {isAdding ? "Saving..." : (editingArticleId ? "Update Article" : "Save Article")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List of articles */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">Published Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              ) : articles.length === 0 ? (
                <p className="text-sm text-white/70">No articles found.</p>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="flex justify-between items-start p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <h4 className="font-semibold text-white">{article.title}</h4>
                        <p className="text-sm text-white/70 mt-1 line-clamp-1">{article.summary}</p>
                        <div className="flex gap-2 mt-2 text-xs text-white/70">
                          <span className="bg-white/10">{article.status}</span>
                          <span className="px-2 py-1">{new Date(article.createdAt?.toDate?.() || article.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-primary/10" onClick={() => startEdit(article)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => article.id && handleDelete(article.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
