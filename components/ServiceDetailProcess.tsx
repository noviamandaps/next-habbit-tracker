import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  getReducedMotionVariants
} from '@/lib/animations'

interface ProcessStep {
  step: number
  title: string
  description: string
  icon: any
}

interface ServiceDetailProcessProps {
  process: ProcessStep[]
}

export function ServiceDetailProcess({ process }: ServiceDetailProcessProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants with reduced motion support
  const getAnimationVariants = (variants: any) =>
    prefersReducedMotion ? getReducedMotionVariants(variants) : variants

  return (
    <div className="container">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Badge variant="outline" className="mb-4">
          <Clock className="w-3 h-3 mr-1" />
          Our Process
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How We Work
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our proven methodology ensures successful project delivery from concept to completion
        </p>
      </motion.div>

      {/* Process Steps */}
      <motion.div
        className="relative"
        variants={getAnimationVariants(staggerContainer)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Connection Line - Hidden on mobile */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 1

            return (
              <motion.div
                key={step.step}
                variants={getAnimationVariants(staggerItem)}
                className="relative"
              >
                <Card className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 ${
                  isEven ? 'lg:mt-16' : ''
                }`}>
                  <CardContent className="p-8 text-center space-y-6">
                    {/* Step Number */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">
                          {step.step}
                        </span>
                      </div>
                      
                      {/* Connection dot for desktop */}
                      <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full -right-8 z-10" />
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for mobile */}
                    {index < process.length - 1 && (
                      <div className="lg:hidden flex justify-center pt-4">
                        <ArrowRight className="w-5 h-5 text-primary/60" />
                      </div>
                    )}
                  </CardContent>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Card>

                {/* Arrow for desktop */}
                {index < process.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center mt-16"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground">
            Let's discuss your project and how our proven process can help you achieve your goals
          </p>
        </div>
      </motion.div>
    </div>
  )
}
