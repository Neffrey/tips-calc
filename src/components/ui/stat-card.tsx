// COMPONENTS
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

// TYPES
type Stats = {
  title: string;
  content: string;
};

type StatCardProps = {
  title: string;
  description?: string;
  stats: Stats[];
  btnText: string;
};

// COMP
const StatCard = ({ title, description, stats, btnText }: StatCardProps) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {stats.map((stat) => {
          return (
            <div
              className="flex w-full justify-between"
              key={`stat_${stat.title}`}
            >
              <div>{stat.title}</div>
              <div>{stat.content}</div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button className="w-full">{btnText}</Button>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
