import { Star } from "lucide-react";
const renderStars = (rating)=>{
    console.log("rating",rating)
    return (
      <div className='flex space-x-1'>
        {
      [...Array(5)].map((_,i) =>(
      <Star className="flex space-x-1" key={i} size={16} fill={i<rating ?'currentColor':'none'} stroke="currentcolor" />
    ))}
    </div>
    );
  };

export default renderStars;