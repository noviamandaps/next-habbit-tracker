import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Calendar, Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { ServiceDetail } from '../data/serviceData'
import { useReducedMotion } from '@/hooks/useInView'
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  getReducedMotionVariants
} from '@/lib/animations'

interface ServiceDetailCTAProps {
  service: ServiceDetail
  testimonial?: {
    quote: string
    author: string
    company: string
    role: string
  }
}

export function ServiceDetailCTA({ service, testimonial }: ServiceDetailCTAProps) {
  const prefersReducedMotion = useReducedMotion()

  // Animation variants with reduced motion support
  const getAnimationVariants = (variants: any) =>
    prefersReducedMotion ? getReducedMotionVariants(variants) : variants

  return (
    <div className="container">
      {/* Testimonial Section */}
      {testimonial && (
        <motion.div
          className="mb-20"
          variants={getAnimationVariants(fadeInUp)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-8 h-8 text-white" />
              </div>
              
              <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="space-y-2">
                <div className="font-semibold text-foreground text-lg">
                  {testimonial.author}
                </div>
                <div className="text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main CTA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          className="space-y-8"
          variants={getAnimationVariants(fadeInLeft)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <Badge variant="outline" className="mb-4">
              <MessageCircle className="w-3 h-3 mr-1" />
              Ready to Start?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to transform your business with {service.title.toLowerCase()}? 
              Our team of experts is here to help you achieve your goals with a solution 
              tailored specifically to your needs.
            </p>
          </div>

          {/* Benefits List */}
          <motion.div
            className="space-y-4"
            variants={getAnimationVariants(staggerContainer)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              'Free initial consultation and project assessment',
              'Detailed project proposal with timeline and costs',
              'Dedicated project manager and development team',
              'Regular updates and transparent communication'
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={getAnimationVariants(staggerItem)}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={getAnimationVariants(staggerItem)}
          >
            <Button asChild size="lg" className="group">
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/portfolio">
                View Our Portfolio
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          className="space-y-6"
          variants={getAnimationVariants(fadeInRight)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Quick Contact Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Quick Response
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a response within 24 hours. We're here to answer your questions and discuss your project.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Call Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Schedule a Call
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book a free 30-minute consultation to discuss your project requirements and goals.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/contact">
                      Book Call
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-xs text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
