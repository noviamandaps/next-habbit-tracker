import { motion } from 'framer-motion'
import { CheckCircle, TrendingUp, Award, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  scaleIn,
  getReducedMotionVariants
} from '@/lib/animations'

interface ServiceDetailFeaturesProps {
  features: string[]
  benefits: string[]
  metrics: {
    label: string
    value: string
    description: string
  }[]
}

export function ServiceDetailFeatures({ features, benefits, metrics }: ServiceDetailFeaturesProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants with reduced motion support
  const getAnimationVariants = (variants: any) =>
    prefersReducedMotion ? getReducedMotionVariants(variants) : variants

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Features Section */}
        <motion.div
          variants={getAnimationVariants(fadeInLeft)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                Key Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What's Included
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive features designed to deliver exceptional results for your business
              </p>
            </div>

            <motion.div
              className="space-y-4"
              variants={getAnimationVariants(staggerContainer)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={getAnimationVariants(staggerItem)}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={getAnimationVariants(fadeInRight)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Business Benefits
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Tangible benefits that drive real business growth and success
              </p>
            </div>

            <motion.div
              className="space-y-4"
              variants={getAnimationVariants(staggerContainer)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={getAnimationVariants(staggerItem)}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                >
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Metrics Section */}
      <motion.div
        className="mt-20"
        variants={getAnimationVariants(fadeInUp)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="w-3 h-3 mr-1" />
            Proven Results
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Track Record
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak to our commitment to excellence and client success
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={getAnimationVariants(staggerContainer)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={getAnimationVariants(staggerItem)}
            >
              <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
                <CardContent className="space-y-4">
                  <div className="text-4xl md:text-5xl font-bold text-primary">
                    {metric.value}
                  </div>
                  <div className="text-xl font-semibold text-foreground">
                    {metric.label}
                  </div>
                  <div className="text-muted-foreground">
                    {metric.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
