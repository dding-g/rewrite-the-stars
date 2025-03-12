import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  id: string;
};
export default function RedirectButtons({ id }: Props) {
  return (
    <div className="flex gap-4">
      <Link href={`/star/${id}/table`}>
        <Button variant="link">To Table View</Button>
      </Link>
      <Link href={`/star/${id}/card`}>
        <Button variant="link">To Card View</Button>
      </Link>
    </div>
  );
}
