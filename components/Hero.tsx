import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-w-[1440px] mx-auto">
            <div className="flex-1 pt-36 padding-x ml-9">
                <div>

                    <p className="2xl:text-[72px] sm:text-[64px] text-[50px] font-extrabold">
                       Créer et gérer <br/>
                        efficacement votre Tournoi.
                    </p>

                    <Link href={'/tournoi/create'} className={` text-white text-xl mt-6 ${buttonVariants({variant: "default"})}`}>Créer Votre Tournoi</Link>
                </div>
                <div>
                    <p className="text-[27px] text-black-100 font-bold mt-5">
                    Rechercher le Tournoi<br/>
                    Parfait pour vous et vos amis.
                    </p>

                   <Link href={'/tournoi/list'} className={` text-xl mt-5 ${buttonVariants({variant: "outline"})}`}>Explorer les tournois</Link>
                </div>
            </div>
            <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen">
                <div className="relative xl:w-full w-[90%] xl:h-full h-[590px] z-0">
                    <Image src="/hero.png" alt="hero" fill className="object-contain" />
                </div>

                <div className="absolute xl:-top-24 xl:-right-1/2 -right-1/4 bg-hero-bg bg-repeat-round -z-10 w-full xl:h-screen h-[590px] overflow-hidden" />
            </div>
        </div>
    )
}