'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/utils/auth';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-18" ></div>
      <Card className="w-full max-w-sm bg-black/0 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-4xl">
            <h3>Welcome Back</h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center" >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full flex justify-center items-center gap-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <div className="h-2" ></div>
            <TabsContent value="login">
              <form className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="signin-email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="signin-password" type="password" placeholder="••••••••••••••••" required />
                </div>
                <Button formAction={login} className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Mecha X" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="signup-email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="signup-password" type="password" placeholder="••••••••••••••••" required />
                </div>
                <Button formAction='' className="w-full">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};