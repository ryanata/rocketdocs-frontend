import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import rocketdocsLogo from '../assets/rocketdocs_logo.svg';
import page from '../assets/page.png';
import { Icon } from '@iconify/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LandingPage: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="bg-gradient-to-b from-white via-white via-60% to-violet-300 h-screen">
            <div className="flex justify-between items-center mx-8">
                <img src={rocketdocsLogo} alt="RocketDocs Logo" />
                <div className="flex items-center space-x-1">
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>How It Works <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>Features <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>Examples <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                    <DropdownButton />
                </div>
                <div className="flex items-center space-x-4">
                    <a onClick={() => navigate('/login')} className="hover:before:scale-x-100 hover:before:origin-left text-2xl relative before:w-full before:h-1 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary before:absolute before:left-0 before:bottom-0">Login</a>
                    <Button className="text-xl" onClick={() => navigate('/signup')}>Sign Up</Button>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16 ">
                {
                    <div className="flex justify-center items-center w-full">
                         <div className="flex flex-col space-y-8 items-center">
                            <h1 className="text-6xl font-semibold text-center">Documentation <br></br> in rocket speeds</h1>
                            <p className="text-2xl text-center">Create documentation out of the box in <br></br> minutes with the power of AI.</p>
                            <Button className="text-xl w-1/5" onClick={() => navigate('/signup')}>Start Creating</Button>
                            <div className="w-5/6">
                                <img src={page} alt="Page" />
                            </div>
                         </div>
                    </div>
                }
            </main>
        </div>
    );
};

const DropdownButton = () => {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Billing</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <span>New Team</span>
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

export default LandingPage;
