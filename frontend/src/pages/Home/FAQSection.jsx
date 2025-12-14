import React from 'react';
import Container from '../../components/Shared/Container';
import Heading from '../../components/Shared/Heading';


const FAQSection = () => {
  const faqs = [
    {
      question: "How do I join a contest?",
      answer: "Simply sign up for an account, browse the 'All Contests' page, and click the 'Register' button on any contest that interests you. Payment is handled securely via Stripe."
    },
    {
      question: "Can I participate in multiple contests?",
      answer: "Absolutely! There is no limit to how many contests you can join. You can track all your active participations in your Dashboard."
    },
    {
      question: "How are winners selected?",
      answer: "Winners are selected by the Contest Creator based on the submission quality. For some contests, we also allow community voting to help decide the champion."
    },
    {
      question: "When do I get my prize money?",
      answer: "Once a winner is declared, the prize money is credited to your dashboard wallet instantly. You can request a withdrawal to your bank account at any time."
    },
    {
      question: "Is there a fee to create a contest?",
      answer: "Contest creation is free! However, you must fund the prize money upfront to ensure trust and security for all participants."
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-gray-900 transition-colors">
      <Container>
        <div className="text-center mb-8 md:mb-12">
            <Heading 
                title="Frequently Asked Questions" 
                subtitle="Everything you need to know about ContestHub" 
                center={true} 
            />
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4 px-2 md:px-0">
          {faqs.map((item, index) => (
            <div 
              key={index} 
              className="collapse collapse-plus bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg md:rounded-xl shadow-sm"
            >
              <input type="radio" name="my-accordion-3" defaultChecked={index === 0} className="peer" /> 
              
              <div className="collapse-title text-base md:text-lg font-medium text-gray-800 dark:text-white peer-checked:text-primary transition-colors pr-10">
                {item.question}
              </div>
              
              <div className="collapse-content text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                <p className="pb-2">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Link */}
        <div className="text-center mt-8 md:mt-12 px-4">
           <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Still have questions? <br className="block sm:hidden" /> {/* Break line on very small screens */}
              <a href="#" className="text-primary font-bold hover:underline ml-1">Contact Support</a>
           </p>
        </div>

      </Container>
    </section>
  );
};

export default FAQSection;