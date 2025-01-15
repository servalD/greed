import { images } from "@/constants/moke/list";
import List from "./ui/list";

export default function GuestOrClient() {

    return (
        <main>
            <List images={images} />
        </main>
      );

}