import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AdviceTabProps {
  currentAdvice: string;
  setCurrentAdvice: (advice: string) => void;
  setNewNote: (note: { title: string; content: string; tags: string }) => void;
  newNote: { title: string; content: string; tags: string };
}

const AdviceTab = ({ currentAdvice, setCurrentAdvice, setNewNote, newNote }: AdviceTabProps) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default AdviceTab;
