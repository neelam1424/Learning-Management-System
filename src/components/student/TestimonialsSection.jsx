import React from 'react'
import { dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation,sucess, and how our <br />platform has made a difference in their lives.</p>
      <div>
        {dummyTestimonial.map((testimonial,index)=>(
          <div key={index}>
            <div>
              <img src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1>{testimonial.name}</h1>
                <p>{testimonial.role}</p>
              </div>
              <div>
                <div>
                  {[...Array(5).map((_, i)=>(
                    <img className='h-5' key={i} src={i < Math.floor(testimonial.rating)? assets.star :asserts.star_blank} alt="star" />
                  ))]}
                </div>
                <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
              </div>
            </div>
          </div>
         
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection