import { useParams } from 'react-router-dom';
import { useDisplay } from '../context/DisplayContext'; // Gunakan context
import TVDisplayCard from '../components/TVDisplayCard';

function TVOutputPage() {
  const { screenId } = useParams();
  const { cards } = useDisplay();
  const index = parseInt(screenId || '1') - 1;
  const data = cards[index];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      {data ? <TVDisplayCard data={data} index={index} onRemove={() => {}} isTVOutput={true} /> : <div>Display is Off</div>}
    </div>
  );
}