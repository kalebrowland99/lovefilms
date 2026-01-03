import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle?: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-xl border-t border-neutral-200 dark:border-neutral-800",
        "bg-gradient-to-b from-neutral-50/50 to-neutral-50/10 dark:from-neutral-900/50 dark:to-neutral-900/10",
        "p-4 text-start sm:p-6",
        "hover:from-neutral-50/60 hover:to-neutral-50/20 dark:hover:from-neutral-900/60 dark:hover:to-neutral-900/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-black dark:text-white">
            {author.name}
          </h3>
          {author.handle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {author.handle}
            </p>
          )}
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        {text}
      </p>
    </Card>
  )
}
