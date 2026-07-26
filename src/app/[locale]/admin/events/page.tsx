"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { getEvents, addEvent, updateEvent, deleteEvent, getEventRegistrations, AABPEvent } from "@/lib/firebase/db-events";
import { getUserProfile, AABPUser } from "@/lib/firebase/db-users";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AABPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Conference");
  const [status, setStatus] = useState<'Published' | 'Draft'>("Published");
  const [imageUrl, setImageUrl] = useState("");
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [regViewOpen, setRegViewOpen] = useState(false);
  const [regEventTitle, setRegEventTitle] = useState("");
  const [registrations, setRegistrations] = useState<(AABPUser | null)[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setIsLoading(true);
    const fetchedEvents = await getEvents();
    setEvents(fetchedEvents);
    setIsLoading(false);
  }

  const handleSaveEvent = async () => {
    if (!title || !date || !location) return toast.error("Please fill all required fields");
    
    try {
      if (editingEventId) {
        await updateEvent(editingEventId, {
          title,
          date,
          location,
          category,
          status,
          imageUrl,
          maxAttendees
        });
        toast.success("Event updated successfully");
      } else {
        await addEvent({
          title,
          date,
          location,
          category,
          status,
          imageUrl,
          maxAttendees
        });
        toast.success("Event created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save event");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setCategory("Conference");
    setImageUrl("");
    setMaxAttendees(undefined);
    setEditingEventId(null);
  };

  const openEditDialog = (event: AABPEvent) => {
    setEditingEventId(event.id || null);
    setTitle(event.title);
    setDate(event.date);
    setLocation(event.location);
    setCategory(event.category);
    setImageUrl(event.imageUrl || "");
    setMaxAttendees(event.maxAttendees);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteEvent(deleteTargetId);
      fetchEvents();
      toast.success("Event deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleViewRegistrations = async (event: AABPEvent) => {
    if (!event.id) return;
    setRegEventTitle(event.title);
    setRegViewOpen(true);
    setRegLoading(true);
    try {
      const regs = await getEventRegistrations(event.id);
      const userProfiles = await Promise.all(regs.map(r => getUserProfile(r.userId)));
      setRegistrations(userProfiles);
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Events CMS</h1>
          <p className="text-white/70 mt-1">Manage and publish platform events.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingEventId ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Input value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. October 15, 2026" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, UK" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Conference">Conference</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value as 'Published' | 'Draft')} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Max Attendees (optional)</label>
                <Input
                  type="number"
                  min={1}
                  value={maxAttendees?.toString() || ""}
                  onChange={e => setMaxAttendees(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Event Image Upload</label>
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
                      formData.append('folder', 'events');
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      setImageUrl(data.url);
                      toast.success("Image uploaded successfully");
                    } catch (err) {
                      toast.error("Failed to upload image");
                      console.error(err);
                    } finally {
                      setUploadingImage(false);
                    }
                  }} 
                />
                {imageUrl && <p className="text-xs text-green-600 mt-1">Image URL generated: {imageUrl}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEvent} disabled={uploadingImage}>{editingEventId ? "Update Event" : "Save Event"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this event? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={regViewOpen} onOpenChange={setRegViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrations — {regEventTitle}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {regLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : registrations.filter(Boolean).length === 0 ? (
              <p className="text-sm text-white/70 text-center py-8">No registrations yet.</p>
            ) : (
              <div className="space-y-2">
                {registrations.filter(Boolean).map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{u!.firstName} {u!.lastName}</p>
                      <p className="text-xs text-white/70">{u!.email}</p>
                    </div>
                    <span className="text-xs text-white/70">{u!.profession || '-'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white/10 p-6 rounded-2xl shadow-sm border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
            <Input 
              placeholder="Search events..." 
              className="pl-9 bg-white/5"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead>Event Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-white/70">Loading events...</TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-white/70">No events found. Create one to get started.</TableCell>
                </TableRow>
              ) : (
                events
                  .filter(event => 
                    !searchQuery || 
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium text-white">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>
                      <Badge variant={event.status === "Published" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-primary/10" onClick={() => handleViewRegistrations(event)} title="View Registrations">
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 text-white hover:bg-primary/10" onClick={() => openEditDialog(event)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => event.id && handleDeleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
