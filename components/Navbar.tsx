
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'
import { UserAccountNav } from './UserAccountNav'
import Image from 'next/image'


const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex justify-center items-center gap-1'>
        <Image
          src='/logo.jpg'
          alt='logo'
          width={50}
          height={15}
          className='object-contain'
        />
        <h2 className='font-bold text-2xl'>Challenger</h2>
      </Link>

        {/* actions */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href={'/sign-in'} className={buttonVariants({variant: "default"})}>Se Connecter</Link>
        )}
      </div>
    </div>
  )
}

export default Navbar

