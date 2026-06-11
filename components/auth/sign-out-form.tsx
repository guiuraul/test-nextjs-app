import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutForm() {
  return (
    <form action={signOutAction}>
      <Button variant="secondary" type="submit">
        Sign out
      </Button>
    </form>
  );
}
