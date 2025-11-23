// /src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Menu, X, LogOut, LayoutDashboard, Mail } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const EmailAuthDialog = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEmailSignIn = async () => {
    setError(null);
    try {
      await signInWithEmail(email, password);
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailSignUp = async () => {
    setError(null);
    try {
      await signUpWithEmail(email, password);
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Sign in with Email</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In or Sign Up</DialogTitle>
          <DialogDescription>
            Enter your email and password to sign in, or create a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" placeholder="name@example.com" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" placeholder="••••••••" />
          </div>
          {error && <p className="col-span-4 text-center text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleEmailSignUp}>Sign Up</Button>
          <Button onClick={handleEmailSignIn}>Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, signOut, signInWithGoogle, signInWithFacebook } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut().catch(console.error);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-navy/70 backdrop-blur-lg border-b border-neon-green/20' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-neon-green" />
          <span className="text-2xl font-bold text-white font-sans">MagicPin</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-neon-green transition-colors duration-300"
            >
              {t(`navbar.${item.label.toLowerCase()}`)}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
              <Button onClick={handleSignOut} size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{t('navbar.login')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-dark-navy border-neon-green/30 text-white">
                <DropdownMenuItem onClick={() => signInWithGoogle().catch(console.error)}>
                  <FcGoogle className="mr-2 h-4 w-4" />
                  <span>Sign in with Google</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signInWithFacebook().catch(console.error)}>
                  <FaFacebook className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Sign in with Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <EmailAuthDialog />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-navy/95 backdrop-blur-lg pb-4">
          <nav className="flex flex-col items-center gap-4 pt-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-neon-green transition-colors duration-300 text-lg"
              >
                {t(`navbar.${item.label.toLowerCase()}`)}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-4 w-full px-8">
               {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild>
                    <a href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </a>
                  </Button>
                  <Button onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => signInWithGoogle().catch(console.error)} className="w-full">
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </Button>
                  <Button onClick={() => signInWithFacebook().catch(console.error)} className="w-full">
                    <FaFacebook className="mr-2 h-4 w-4" />
                    Sign in with Facebook
                  </Button>
                  {/* TODO: Add Email sign in for mobile */}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
