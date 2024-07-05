import { formatDistanceToNow } from "date-fns";
interface TimeAgoPromis {
  date: Date;
}
const TimeAgo: React.FC<TimeAgoPromis> = ({ date }) => {
  return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>;
};

export default TimeAgo;
