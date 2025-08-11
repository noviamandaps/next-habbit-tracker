import { motion } from 'framer-motion'
import { CheckCircle, Star, ArrowRight, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
  getReducedMotionVariants
} from '@/lib/animations'

interface Package {
  name: string
  price: string
  currency: string
  features: string[]
  popular?: boolean
}

interface ServiceDetailPackagesProps {
  packages: Package[]
}

export function ServiceDetailPackages({ packages }: ServiceDetailPackagesProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants with reduced motion support
  const getAnimationVariants = (variants: any) =>
    prefersReducedMotion ? getReducedMotionVariants(variants) : variants

  return (
    <div className="container" id="packages">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Badge variant="outline" className="mb-4">
          <DollarSign className="w-3 h-3 mr-1" />
          Pricing Packages
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Choose Your Package
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Flexible pricing options designed to meet your specific needs and budget requirements
        </p>
      </motion.div>

      {/* Packages Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={getAnimationVariants(staggerContainer)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            variants={getAnimationVariants(staggerItem)}
            className="relative"
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <Card className={`group h-full hover:shadow-2xl transition-all duration-500 ${
              pkg.popular 
                ? 'border-2 border-primary/50 shadow-lg scale-105' 
                : 'border-2 hover:border-primary/30'
            }`}>
              <CardHeader className="text-center pb-8">
                {/* Package Name */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      {pkg.currency === 'USD' ? '$' : pkg.currency}
                    </span>
                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                      {pkg.price.replace(/,/g, '')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Starting price for this package
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-8">
                <Button 
                  asChild 
                  className={`w-full group-hover:scale-105 transition-transform duration-300 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' 
                      : ''
                  }`}
                  variant={pkg.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardFooter>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                pkg.popular 
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10' 
                  : 'bg-gradient-to-r from-primary/5 to-accent/5'
              }`} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Info */}
      <motion.div
        className="text-center mt-16"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground">
            Don't see a package that fits your needs? We offer custom solutions tailored to your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Request Custom Quote
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/portfolio">
                View Our Work
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
