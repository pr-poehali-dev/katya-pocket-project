import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import NotesTab from '@/components/NotesTab';
import GamesTab from '@/components/GamesTab';
import MusicTab from '@/components/MusicTab';
import AdviceTab from '@/components/AdviceTab';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface Settings {
  theme: 'light' | 'dark';
  username: string;
}

const Index = () => {
  const [greeting, setGreeting] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [settings, setSettings] = useState<Settings>({ theme: 'light', username: 'Катя' });
  const [emotionScore, setEmotionScore] = useState(0);
  const [currentAdvice, setCurrentAdvice] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Доброе утро');
    else if (hour < 18) setGreeting('Добрый день');
    else setGreeting('Добрый вечер');

    const savedNotes = localStorage.getItem('katya-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      const demoNotes: Note[] = [
        {
          id: '1',
          title: 'Мои мысли о сегодняшнем дне',
          content: 'Сегодня был чудесный день! Прогулялась в парке, почитала любимую книгу.',
          tags: ['настроение', 'день'],
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 86400000
        },
        {
          id: '2',
          title: 'Идеи для выходных',
          content: 'Посетить новую кофейню, сходить на выставку, встретиться с друзьями.',
          tags: ['планы', 'выходные'],
          createdAt: Date.now() - 43200000,
          updatedAt: Date.now() - 43200000
        }
      ];
      setNotes(demoNotes);
      localStorage.setItem('katya-notes', JSON.stringify(demoNotes));
    }

    const savedSettings = localStorage.getItem('katya-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }

    const savedSpotify = localStorage.getItem('katya-spotify');
    if (savedSpotify) setSpotifyUrl(savedSpotify);

    const savedScore = localStorage.getItem('katya-emotion-score');
    if (savedScore) setEmotionScore(parseInt(savedScore));
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
    localStorage.setItem('katya-settings', JSON.stringify({ ...settings, theme: newTheme }));
    document.documentElement.classList.toggle('dark');
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'katya-notes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Заметки экспортированы!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {greeting}, {settings.username} 🌸
              </h1>
              <p className="text-muted-foreground text-lg">Твоё уютное пространство</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="hover-scale">
                  <Icon name="Settings" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Настройки</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Тёмная тема</Label>
                    <Switch
                      id="theme"
                      checked={settings.theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Твоё имя</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => {
                        const newSettings = { ...settings, username: e.target.value };
                        setSettings(newSettings);
                        localStorage.setItem('katya-settings', JSON.stringify(newSettings));
                      }}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={exportNotes} className="w-full">
                    <Icon name="Download" size={18} className="mr-2" />
                    Экспортировать заметки
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-card/50 backdrop-blur">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Icon name="Home" size={16} />
              <span className="hidden md:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <Icon name="StickyNote" size={16} />
              <span className="hidden md:inline">Заметки</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Icon name="Gamepad2" size={16} />
              <span className="hidden md:inline">Игры</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Icon name="Music" size={16} />
              <span className="hidden md:inline">Музыка</span>
            </TabsTrigger>
            <TabsTrigger value="advice" className="flex items-center gap-2">
              <Icon name="Sparkles" size={16} />
              <span className="hidden md:inline">Советы</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Icon name="Info" size={16} />
              <span className="hidden md:inline">О проекте</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur animate-scale-in">
              <h2 className="text-2xl font-bold mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => document.querySelector<HTMLElement>('[value="notes"]')?.click()} className="h-24 flex flex-col gap-2">
                  <Icon name="Plus" size={24} />
                  <span>Создать заметку</span>
                </Button>
                <Button onClick={() => document.querySelector<HTMLElement>('[value="games"]')?.click()} variant="secondary" className="h-24 flex flex-col gap-2">
                  <Icon name="Gamepad2" size={24} />
                  <span>Начать игру</span>
                </Button>
                <Button onClick={() => document.querySelector<HTMLElement>('[value="music"]')?.click()} variant="outline" className="h-24 flex flex-col gap-2">
                  <Icon name="Music" size={24} />
                  <span>Послушать музыку</span>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur">
              <h3 className="text-xl font-bold mb-3">Твои заметки</h3>
              <p className="text-muted-foreground mb-2">
                Всего заметок: <span className="font-bold text-foreground">{notes.length}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Последняя заметка: {notes[0]?.title || 'Пока нет заметок'}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab
              notes={notes}
              setNotes={setNotes}
              newNote={newNote}
              setNewNote={setNewNote}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="games">
            <GamesTab
              emotionScore={emotionScore}
              setEmotionScore={setEmotionScore}
            />
          </TabsContent>

          <TabsContent value="music">
            <MusicTab
              spotifyUrl={spotifyUrl}
              setSpotifyUrl={setSpotifyUrl}
            />
          </TabsContent>

          <TabsContent value="advice">
            <AdviceTab
              currentAdvice={currentAdvice}
              setCurrentAdvice={setCurrentAdvice}
              setNewNote={setNewNote}
              newNote={newNote}
            />
          </TabsContent>

          <TabsContent value="about" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">О проекте Katya Pocket</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Katya Pocket — твоё персональное уютное пространство для заметок, игр, советов и музыки.
                </p>
                <p>
                  Все данные хранятся локально в твоём браузере. Ничего не отправляется на сервер.
                  Твои заметки и настройки останутся только с тобой.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm">Версия: 1.0.0</p>
                  <p className="text-sm">Сделано с 💖</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
