import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
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

interface GameProgress {
  gameId: string;
  score: number;
  lastPlayed: number;
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

  const advices = [
    { id: 1, text: 'Напиши маленькую заметку о сегодняшнем дне', category: 'творчество', timeOfDay: 'evening' },
    { id: 2, text: 'Послушай любимую музыку и расслабься', category: 'отдых', timeOfDay: 'evening' },
    { id: 3, text: 'Сыграй в игру "Угадай эмоцию" — зарядись позитивом!', category: 'развлечение', timeOfDay: 'day' },
    { id: 4, text: 'Прогуляйся 15 минут и подыши свежим воздухом', category: 'здоровье', timeOfDay: 'day' },
    { id: 5, text: 'Почитай несколько страниц интересной книги', category: 'творчество', timeOfDay: 'evening' },
    { id: 6, text: 'Выпей чашку любимого чая и подумай о приятном', category: 'отдых', timeOfDay: 'morning' },
    { id: 7, text: 'Сделай небольшую зарядку или растяжку', category: 'здоровье', timeOfDay: 'morning' }
  ];

  const getRandomAdvice = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
    const filtered = advices.filter(a => a.timeOfDay === timeOfDay);
    const randomAdvice = filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : advices[Math.floor(Math.random() * advices.length)];
    setCurrentAdvice(randomAdvice.text);
  };

  const playEmotionGame = (emotion: string) => {
    const correctEmotion = 'радость';
    if (emotion === correctEmotion) {
      const newScore = emotionScore + 10;
      setEmotionScore(newScore);
      localStorage.setItem('katya-emotion-score', newScore.toString());
      toast.success('Правильно! +10 баллов 🎉');
    } else {
      toast.error('Попробуй ещё раз!');
    }
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
    localStorage.setItem('katya-settings', JSON.stringify({ ...settings, theme: newTheme }));
    document.documentElement.classList.toggle('dark');
  };

  const saveSpotifyUrl = () => {
    localStorage.setItem('katya-spotify', spotifyUrl);
    toast.success('Плейлист сохранён ✅');
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

          <TabsContent value="notes" className="space-y-6 animate-fade-in">
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
          </TabsContent>

          <TabsContent value="games" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">Угадай эмоцию</h2>
              <p className="text-muted-foreground mb-4">
                Баллов: <span className="font-bold text-foreground">{emotionScore}</span>
              </p>
              <div className="space-y-4">
                <p className="text-lg">Ситуация: "Получила подарок от близкого человека"</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button onClick={() => playEmotionGame('радость')} variant="outline">
                    😊 Радость
                  </Button>
                  <Button onClick={() => playEmotionGame('грусть')} variant="outline">
                    😢 Грусть
                  </Button>
                  <Button onClick={() => playEmotionGame('злость')} variant="outline">
                    😠 Злость
                  </Button>
                  <Button onClick={() => playEmotionGame('удивление')} variant="outline">
                    😲 Удивление
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/20 to-muted/20 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">Ассоциации</h2>
              <p className="text-muted-foreground mb-4">Выбери слова, связанные с "Уют"</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Тепло', 'Дом', 'Холод', 'Комфорт', 'Стресс', 'Спокойствие'].map((word) => (
                  <Button 
                    key={word} 
                    variant="secondary" 
                    className="h-16"
                    onClick={() => {
                      const correctWords = ['Тепло', 'Дом', 'Комфорт', 'Спокойствие'];
                      if (correctWords.includes(word)) {
                        toast.success('Правильно! ✨');
                      } else {
                        toast.error('Попробуй другое слово');
                      }
                    }}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card/80 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">Музыкальный уголок</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="spotify">Ссылка на Spotify плейлист</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="spotify"
                      placeholder="https://open.spotify.com/playlist/..."
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                    />
                    <Button onClick={saveSpotifyUrl}>
                      <Icon name="Save" size={18} />
                    </Button>
                  </div>
                </div>

                {spotifyUrl ? (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center p-4">
                    <div className="text-center">
                      <Icon name="Music" size={48} className="mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground text-sm">
                        Spotify плейлист сохранён
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 break-all">
                        {spotifyUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10">
                    <h3 className="text-xl font-bold mb-4">Demo плейлист 🎵</h3>
                    <div className="space-y-3">
                      {['Relaxing Piano', 'Nature Sounds', 'Cozy Vibes'].map((track) => (
                        <div key={track} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg hover-scale cursor-pointer">
                          <Icon name="Music" size={20} className="text-primary" />
                          <span>{track}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advice" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">Не знаешь, что делать?</h2>
              <p className="text-muted-foreground mb-4">Получи персональный совет на сегодня</p>
              <Button onClick={getRandomAdvice} className="w-full mb-4" size="lg">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Получить совет
              </Button>

              {currentAdvice && (
                <Card className="p-6 bg-card/80 animate-scale-in">
                  <div className="flex items-start gap-3">
                    <Icon name="Lightbulb" size={24} className="text-accent flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-3">{currentAdvice}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewNote({ ...newNote, title: 'Совет дня', content: currentAdvice });
                          document.querySelector<HTMLElement>('[value="notes"]')?.click();
                          toast.success('Совет добавлен в заметки!');
                        }}
                      >
                        <Icon name="BookmarkPlus" size={16} className="mr-2" />
                        Сохранить как заметку
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
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
