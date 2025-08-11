import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ServiceDetail } from '../data/serviceData'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  badgeFloat,
  parallaxFloat,
  getReducedMotionVariants
} from '@/lib/animations'

interface ServiceDetailHeroProps {
  service: ServiceDetail
}

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const Icon = service.icon

  // Animation variants with reduced motion support
  const getAnimationVariants = (variants: any) =>
    prefersReducedMotion ? getReducedMotionVariants(variants) : variants

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background with gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Floating background elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        variants={getAnimationVariants(parallaxFloat)}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-3xl"
        variants={getAnimationVariants(parallaxFloat)}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            variants={getAnimationVariants(staggerContainer)}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            {service.badge && (
              <motion.div variants={getAnimationVariants(badgeFloat)}>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Star className="w-3 h-3 mr-1" />
                  {service.badge}
                </Badge>
              </motion.div>
            )}

            {/* Title */}
            <motion.div variants={getAnimationVariants(staggerItem)} className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium">
                {service.subtitle}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={getAnimationVariants(staggerItem)}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              {service.description}
            </motion.p>

            {/* Metrics */}
            <motion.div
              variants={getAnimationVariants(staggerItem)}
              className="grid grid-cols-3 gap-6 py-6"
            >
              {service.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={getAnimationVariants(staggerItem)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="group">
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Icon/Visual */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={getAnimationVariants(fadeInRight)}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              {/* Main icon container */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary/10">
                <Icon className="w-32 h-32 md:w-40 md:h-40 text-primary" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/30 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/30 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
