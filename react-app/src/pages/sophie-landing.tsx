import { Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SophieLogo } from "@/components/SophieLogo";

const dailyInspiration = [
  "You may not always see the seeds take root—but every action you take plants something enduring. Trust that the forest is growing, even if right now you can only see the soil.",
  "Innovation isn't about having all the answers; it's about asking better questions and being brave enough to explore the unknown paths ahead.",
  "Every breakthrough in science began with someone willing to challenge what everyone else accepted as impossible. Your curiosity is your greatest asset.",
  "The molecules you work with today could be tomorrow's miracle. Never underestimate the power of persistent discovery.",
  "In biopharmaceutical development, patience and precision dance together. Each careful step forward is progress, even when the destination feels distant.",
  "Your research doesn't just change compounds—it changes lives. Remember that behind every data point is hope for someone's future.",
  "The best discoveries often come from the intersection of preparation and unexpected opportunity. Stay ready for those moments of insight.",
  "Science is the art of turning impossible into inevitable, one hypothesis at a time. Your work is part of that magnificent transformation.",
  "Every failed experiment teaches us something valuable. In research, there are no true failures—only data that guides us toward success.",
  "The complexity of biology is not an obstacle—it's an invitation to think more creatively and discover solutions no one has imagined yet.",
  "Your dedication to rigorous science today builds the foundation for breakthrough therapies tomorrow. Every detail matters.",
  "In the lab and beyond, courage isn't the absence of uncertainty—it's moving forward with purpose despite the unknowns.",
  "The most profound impacts often come from the quietest work. Your daily efforts ripple outward in ways you may never fully see.",
  "Excellence in research isn't about being perfect; it's about being consistently thoughtful, curious, and committed to growth.",
  "Behind every successful drug lies thousands of small decisions made with care. Your attention to detail is shaping the future of medicine.",
  "Innovation thrives when we combine scientific rigor with creative thinking. Don't be afraid to approach old problems with fresh perspectives.",
  "The path from bench to bedside is long, but every step you take with integrity and passion brings healing closer to those who need it.",
  "Your work bridges the gap between what is and what could be. That bridge is built one careful experiment at a time.",
  "In biopharmaceutical research, we don't just develop drugs—we develop hope. Your contributions matter more than you might realize.",
  "The best scientists are perpetual students, always learning, always questioning. Your willingness to grow is your greatest strength.",
  "Collaboration amplifies innovation. The connections you build today may become the partnerships that change tomorrow's therapeutic landscape.",
  "Precision in method leads to clarity in results. Your methodical approach today prevents confusion and accelerates progress tomorrow.",
  "Every challenge in drug development is an opportunity to innovate. What seems impossible today becomes routine through dedicated effort.",
  "Your research is a conversation with nature, asking questions through experimentation and listening carefully to the answers.",
  "The intersection of technology and biology offers endless possibilities. Your work helps us read and rewrite the language of life itself.",
];

function getDailyInspiration(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dailyInspiration[dayOfYear % dailyInspiration.length];
}

export default function SophieLanding() {
  const todaysInspiration = getDailyInspiration();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Enhanced Molecular Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        {/* Enhanced floating molecular nodes with more movement */}
        <div className="absolute top-20 left-16 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-24 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 left-32 w-7 h-7 bg-cyan-300 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/2 right-16 w-5 h-5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-6 h-6 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        
        {/* Additional floating nodes for more dynamic feel */}
        <div className="absolute top-40 right-40 w-5 h-5 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-60 left-20 w-4 h-4 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 left-60 w-6 h-6 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-20 right-60 w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '3.5s'}}></div>
        <div className="absolute top-80 right-80 w-5 h-5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-80 left-80 w-4 h-4 bg-teal-300 rounded-full animate-bounce" style={{animationDelay: '2.8s'}}></div>
        
        {/* Organic molecular connections */}
        <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
          <defs>
            <pattern id="molecular-grid-sophie" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="rgb(99 102 241 / 0.25)" />
              <circle cx="20" cy="20" r="1" fill="rgb(6 182 212 / 0.2)" />
              <circle cx="60" cy="20" r="0.8" fill="rgb(59 130 246 / 0.15)" />
              <circle cx="20" cy="60" r="1.2" fill="rgb(6 182 212 / 0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#molecular-grid-sophie)" />
          
          {/* Enhanced organic curved connections */}
          <path d="M20 30 Q 80 50, 120 80 T 200 120 T 300 160" stroke="rgb(59 130 246 / 0.4)" strokeWidth="2" fill="none" strokeDasharray="3,6">
            <animate attributeName="stroke-dashoffset" values="0;9" dur="25s" repeatCount="indefinite"/>
          </path>
          <path d="M80 20 Q 60 70, 40 120 T 20 200 T 80 280" stroke="rgb(99 102 241 / 0.3)" strokeWidth="1.5" fill="none" strokeDasharray="2,8">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="30s" repeatCount="indefinite"/>
          </path>
          <path d="M70 80 Q 120 60, 180 90 T 250 110 T 320 140" stroke="rgb(6 182 212 / 0.35)" strokeWidth="1.5" fill="none" strokeDasharray="4,5">
            <animate attributeName="stroke-dashoffset" values="0;9" dur="20s" repeatCount="indefinite"/>
          </path>
          <path d="M200 20 Q 150 80, 100 140 T 50 220 T 150 300" stroke="rgb(6 182 212 / 0.25)" strokeWidth="1.2" fill="none" strokeDasharray="5,7">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="35s" repeatCount="indefinite"/>
          </path>
          <path d="M300 60 Q 250 120, 200 180 T 150 260 T 250 340" stroke="rgb(59 130 246 / 0.3)" strokeWidth="1.8" fill="none" strokeDasharray="3,5">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="28s" repeatCount="indefinite"/>
          </path>
          <path d="M400 100 Q 350 160, 300 220 T 250 300 T 350 380" stroke="rgb(99 102 241 / 0.28)" strokeWidth="1.6" fill="none" strokeDasharray="4,6">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="32s" repeatCount="indefinite"/>
          </path>
          
          {/* Additional dynamic flowing lines */}
          <path d="M50 200 Q 150 180, 250 200 T 400 220 T 550 240" stroke="rgb(6 182 212 / 0.3)" strokeWidth="1.4" fill="none" strokeDasharray="6,4">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="18s" repeatCount="indefinite"/>
          </path>
          <path d="M600 50 Q 500 100, 400 150 T 300 250 T 200 350" stroke="rgb(59 130 246 / 0.35)" strokeWidth="1.8" fill="none" strokeDasharray="3,7">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="22s" repeatCount="indefinite"/>
          </path>
          <path d="M100 400 Q 200 350, 300 400 T 500 420 T 700 400" stroke="rgb(99 102 241 / 0.25)" strokeWidth="1.3" fill="none" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="26s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
      
      <div className="w-full max-w-2xl px-6 relative z-10">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="text-center space-y-8 p-8">
            {/* Sophie Icon */}
            <div className="flex justify-center">
              <SophieLogo size="lg" className="w-16 h-16" />
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-navy-900">
                Good morning! Let's make some magic today!
              </h1>
              
              {/* Inspirational Quote */}
              <div className="border-l-4 border-primary/30 pl-6 py-4 bg-slate-50/50 rounded-r-lg">
                <p className="text-gray-700 italic leading-relaxed">
                  "{todaysInspiration}"
                </p>
              </div>
            </div>


            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900">Ask me anything</h3>
                <p className="text-sm text-gray-600 mt-1">Get insights on your development strategy</p>
              </div>
              <div className="p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900">Risk Assessment</h3>
                <p className="text-sm text-gray-600 mt-1">Identify potential issues early</p>
              </div>
              <div className="p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900">Regulatory Guidance</h3>
                <p className="text-sm text-gray-600 mt-1">Navigate FDA/EMA requirements</p>
              </div>
              <div className="p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900">Market Intelligence</h3>
                <p className="text-sm text-gray-600 mt-1">Understand competitive landscape</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}