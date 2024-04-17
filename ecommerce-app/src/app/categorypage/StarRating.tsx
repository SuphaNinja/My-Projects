
import '@fortawesome/fontawesome-free/css/all.min.css';

const StarRating = ({ rating }: any) => {
    const renderStars = () => {
        const filledStars = Math.floor(rating); // Number of filled stars
        const remainder = rating - filledStars; // Decimal part for the partially filled star
        const stars = [];

        // Adding filled stars
        for (let i = 0; i < filledStars; i++) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        }

        // Adding partially filled star if remainder is more than 0
        if (remainder > 0) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
        }

        // Adding unfilled stars to complete 5 stars
        const remainingStars = 5 - filledStars - (remainder > 0 ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<i key={filledStars + i} className="far fa-star text-yellow-500"></i>);
        }

        return stars;
    };

    return <div className="text-sm">{renderStars()}</div>;
};

export default StarRating;