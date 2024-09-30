import RatingPill from "./rating-pill";

interface IProps {
  ratings?: string[];
  activeRating?: string;
  handleShareRating: (rating: string) => void;
}

const FeedbackRating = (props: IProps) => {
  const {
    ratings = ["Excellent", "Good", "Average", "Poor", "Very Poor"],
    activeRating,
    handleShareRating,
  } = props;

  return (
    <div className="ui-flex ui-items-center ui-gap-2">
      {ratings.map((rating) => (
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
