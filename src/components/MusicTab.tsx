import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MusicTabProps {
  spotifyUrl: string;
  setSpotifyUrl: (url: string) => void;
}

const MusicTab = ({ spotifyUrl, setSpotifyUrl }: MusicTabProps) => {
  const saveSpotifyUrl = () => {
    localStorage.setItem('katya-spotify', spotifyUrl);
    toast.success('Плейлист сохранён ✅');
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
};

export default MusicTab;
