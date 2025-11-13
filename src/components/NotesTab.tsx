import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface NotesTabProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  newNote: { title: string; content: string; tags: string };
  setNewNote: (note: { title: string; content: string; tags: string }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NotesTab = ({ notes, setNotes, newNote, setNewNote, searchQuery, setSearchQuery }: NotesTabProps) => {
  const saveNote = () => {
    if (!newNote.title || !newNote.content) {
      toast.error('Заполни название и текст заметки');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('katya-notes', JSON.stringify(updatedNotes));
    setNewNote({ title: '', content: '', tags: '' });
    toast.success('Заметка сохранена ✅');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('katya-notes', JSON.stringify(updatedNotes));
    toast.success('Заметка удалена');
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-card/80 backdrop-blur">
        <h2 className="text-2xl font-bold mb-4">Создать заметку</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note-title">Название</Label>
            <Input
              id="note-title"
              placeholder="О чём заметка?"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="note-content">Текст</Label>
            <Textarea
              id="note-content"
              placeholder="Твои мысли..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="mt-2 min-h-32"
            />
          </div>
          <div>
            <Label htmlFor="note-tags">Теги (через запятую)</Label>
            <Input
              id="note-tags"
              placeholder="настроение, идеи, планы"
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              className="mt-2"
            />
          </div>
          <Button onClick={saveNote} className="w-full">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить заметку
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Search" size={20} />
          <Input
            placeholder="Поиск по заметкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Пока нет заметок</p>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className="p-4 hover-scale transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{note.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 w-8"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                <p className="text-muted-foreground mb-3">{note.content}</p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(note.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotesTab;
