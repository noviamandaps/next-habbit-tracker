import { motion } from 'framer-motion'
import { Cpu, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
  getReducedMotionVariants
} from '@/lib/animations'

interface Technology {
  name: string
  icon: any
  description: string
}

interface ServiceDetailTechnologiesProps {
  technologies: Technology[]
}

export function ServiceDetailTechnologies({ technologies }: ServiceDetailTechnologiesProps) {
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
          <Cpu className="w-3 h-3 mr-1" />
          Technology Stack
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Cutting-Edge Technologies
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We leverage the latest technologies and frameworks to build robust, scalable, and future-proof solutions
        </p>
      </motion.div>

      {/* Technologies Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={getAnimationVariants(staggerContainer)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {technologies.map((tech, index) => {
          const Icon = tech.icon

          return (
            <motion.div
              key={index}
              variants={getAnimationVariants(staggerItem)}
              whileHover="hover"
              initial="rest"
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 cursor-pointer">
                <CardContent className="p-8 text-center space-y-6 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {tech.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {tech.description}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/40 transition-all duration-300" />
                </CardContent>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Additional Info Section */}
      <motion.div
        className="mt-20 text-center"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Future-Proof Architecture
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Our technology choices are driven by performance, scalability, and maintainability. 
                We stay current with industry best practices to ensure your solution remains competitive 
                and adaptable to future requirements.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">50ms</div>
                  <div className="text-sm text-muted-foreground">Average Response Time</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Security Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
