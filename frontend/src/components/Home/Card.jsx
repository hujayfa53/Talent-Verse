import { Link } from "react-router";

const Card = ({ contest }) => {
  console.log(contest);
  const { _id, name, image, description, category, participate, prize } =
    contest || {};
  return (
    <div className="col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl">
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            "
        >
          <img
            className="
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              "
            src={image}
            alt="Plant Image"
          />
          <div
            className="
              absolute
              top-3
              right-3
            "
          ></div>
        </div>
        <div className="font-semibold text-xl">{name}</div>
        <div className="font-semibold text-lg">Category: {category}</div>
        <div className="font-semibold text-lg">Participate: {participate}</div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold text-lg"> Price: {prize}$</div>
        </div>
        <div className="font-semibold text-lg ">
          Description:{" "}
          {description.length > 50
            ? description.slice(0, 50) + "..."
            : description}
        </div>
        <Link to={`/plant/${_id}`} className="btn btn-primary">Show Details</Link>
      </div>
    </div>
  );
};

export default Card;
