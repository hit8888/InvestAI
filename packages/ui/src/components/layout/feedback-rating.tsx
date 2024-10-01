import RatingPill from "./rating-pill";

interface IProps {
  activeRating?: string;
  handleShareRating: (rating: string) => void;
}

const RATINGS = [
  "Incorrect",
  "Incomplete",
  "Don’t like the style",
  "Problem with Source",
  "Other…",
];

const FeedbackRating = (props: IProps) => {
  const { activeRating, handleShareRating } = props;

  return (
    <div className="ui-flex ui-items-center ui-gap-2">
      {RATINGS.map((rating) => (
        <RatingPill
          key={rating}
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
