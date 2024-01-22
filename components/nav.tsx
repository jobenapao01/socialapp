import { Mukta } from 'next/font/google';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';
import { UserButton } from './user-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
const mukta = Mukta({ subsets: ['latin'], weight: ['800'] });

export default async function Nav() {
	const user = await auth();
	if (!user) redirect('/api/auth/signin');
	return (
		<nav className={cn('text-2xl italic', mukta.className)}>
			<ul className='flex py-8 justify-between items-center shadow-md'>
				<li>Social App</li>

				<li>
					{!user ? (
						<Button asChild>
							<Link href={'/auth/login'}>Sign In</Link>
						</Button>
					) : (
						<UserButton
							expires={user.expires}
							user={user.user}
						/>
					)}
				</li>
			</ul>
		</nav>
	);
}
