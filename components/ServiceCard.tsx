import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features?: string[]
  price?: {
    starting: string
    currency: string
  }
  href?: string
  badge?: string
}

export function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  features = [],
  price,
  href = '#',
  badge
}: ServiceCardProps) {
  return (
    <Card className="group relative h-full bg-card hover:bg-card/80 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-6 z-10">
          <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-soft">
            {badge}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Price */}
          {price && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Starting at</div>
              <div className="text-lg font-bold text-foreground">
                {price.currency === 'USD' ? '$' : price.currency}{price.starting}
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
            <ul className="space-y-1">
              {features.slice(0, 4).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
              {features.length > 4 && (
                <li className="text-sm text-muted-foreground/70 italic">
                  +{features.length - 4} more features
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          asChild 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          variant="outline"
        >
          <Link href={href}>
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}
