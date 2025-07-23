import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, School, Users, BookOpen, Wrench } from 'lucide-react';
import campusHero from '@/assets/campus-hero.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@university.edu', password: 'admin123', icon: School, color: 'text-primary' },
    { role: 'Lecturer', email: 'lecturer@university.edu', password: 'lecturer123', icon: BookOpen, color: 'text-secondary' },
    { role: 'Student', email: 'student@university.edu', password: 'student123', icon: Users, color: 'text-accent' },
    { role: 'Maintenance', email: 'maintenance@university.edu', password: 'maintenance123', icon: Wrench, color: 'text-muted-foreground' }
  ];

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-hero">
        <img 
          src={campusHero} 
          alt="University Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <School className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Campus Resources</h1>
            <p className="text-xl opacity-90">Management System</p>
            <p className="mt-4 text-lg opacity-80">Streamline resource booking and allocation for your university</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:hidden mb-8">
            <School className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Campus Resources</h1>
            <p className="text-muted-foreground">Management System</p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <Alert className="border-destructive">
                    <AlertDescription className="text-destructive">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Demo Accounts</CardTitle>
              <CardDescription>Click to auto-fill credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  return (
                    <Button
                      key={account.role}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                      onClick={() => fillDemo(account.email, account.password)}
                    >
                      <Icon className={`w-5 h-5 ${account.color}`} />
                      <span className="text-sm font-medium">{account.role}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;