import { CardState, formatInterval, getTimeUntilReview } from "@/lib/sm2";

interface CardInfoProps {
  state: CardState;
}

const CardInfo = ({ state }: CardInfoProps) => {
  const isNew = state.repetitions === 0 && state.interval === 0;

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
      {isNew ? (
        <span className="px-2 py-1 bg-accent/20 text-accent rounded-full font-medium">
          New Card
        </span>
      ) : (
        <>
          <span>
            Interval: <strong className="text-foreground">{formatInterval(state.interval)}</strong>
          </span>
          <span>•</span>
          <span>
            EF: <strong className="text-foreground">{state.easinessFactor.toFixed(2)}</strong>
          </span>
          <span>•</span>
          <span>
            <strong className="text-foreground">{getTimeUntilReview(state)}</strong>
          </span>
        </>
      )}
    </div>
  );
};

export default CardInfo;
