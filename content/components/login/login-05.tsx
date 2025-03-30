import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login05() {
  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo
          className="mx-auto h-10 w-10 text-foreground dark:text-foreground"
          aria-hidden={true}
        />
        <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
          Create new account for workspace
        </h3>
      </div>

      <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent>
          <form action="#" method="post" className="space-y-4">
            <div>
              <Label
                htmlFor="name-login-05"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Name
              </Label>
              <Input
                type="text"
                id="name-login-05"
                name="name-login-05"
                autoComplete="name-login-05"
                placeholder="Name"
                className="mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="email-login-05"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email-login-05"
                name="email-login-05"
                autoComplete="email-login-05"
                placeholder="ephraim@blocks.so"
                className="mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="password-login-05"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password-login-05   "
                name="password-login-05"
                autoComplete="password-login-05"
                placeholder="Password"
                className="mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="confirm-password-login-05"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Confirm password
              </Label>
              <Input
                type="password"
                id="confirm-password-login-05"
                name="confirm-password-login-05"
                autoComplete="confirm-password-login-05"
                placeholder="Password"
                className="mt-2"
              />
            </div>

            <div className="mt-2 flex items-start">
              <div className="flex h-6 items-center">
                <Checkbox
                  id="newsletter-login-05"
                  name="newsletter-login-05"
                  className="size-4"
                />
              </div>
              <Label
                htmlFor="newsletter-login-05"
                className="ml-3 text-sm leading-6 text-muted-foreground dark:text-muted-foreground"
              >
                Sign up to our newsletter
              </Label>
            </div>

            <Button type="submit" className="mt-4 w-full py-2 font-medium">
              Create account
            </Button>

            <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
              >
                Terms of use
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
              >
                Privacy policy
              </a>
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground dark:text-muted-foreground">
        Already have an account?{" "}
        <a
          href="#"
          className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
