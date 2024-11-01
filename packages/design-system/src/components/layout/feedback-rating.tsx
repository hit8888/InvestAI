import RatingPill from "./rating-pill";

interface IProps {
  activeRating?: string;
  isReadOnly?: boolean;
  handleShareRating: (rating: string) => void;
}

const RATINGS = [
  "Incorrect",
  "Incomplete",
  "Incorrect video",
  "Don’t like the style",
  "Problem with Source",
  "Other…",
];

const FeedbackRating = (props: IProps) => {
  const { activeRating, isReadOnly = false, handleShareRating } = props;

  return (
    <div className="flex items-center gap-2">
      {RATINGS.map((rating) => (
        <RatingPill
          key={rating}
          disabled={isReadOnly}
          text={rating}
          isActive={activeRating === rating}
          handleOnClick={() => {
            handleShareRating(rating);
          }}
        />
      ))}
    </div>
  );
};

export default FeedbackRating;
