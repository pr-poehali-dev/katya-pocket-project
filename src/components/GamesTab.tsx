import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GamesTabProps {
  emotionScore: number;
  setEmotionScore: (score: number) => void;
}

const GamesTab = ({ emotionScore, setEmotionScore }: GamesTabProps) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default GamesTab;
